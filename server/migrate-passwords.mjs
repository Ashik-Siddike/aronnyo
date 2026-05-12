/**
 * One-time migration script: hash all existing user passwords in DB.
 * Run: node server/migrate-passwords.mjs
 */
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME   = process.env.DB_NAME || 'play_learn_grow';
const SALT      = 12;

// Default passwords for demo accounts (ONLY used during migration)
const DEMO_PASSWORDS = {
  'ashiksiddike@gmail.com': 'ashik1234',
  'admin@school.com':       'admin123',
  'demo@school.com':        'demo123',
  'teacher@school.com':     'teacher123',
  'parent@school.com':      'parent123',
  'virifat01@gmail.com':    'rifat123',
};

const client = new MongoClient(MONGO_URI);
await client.connect();
const db   = client.db(DB_NAME);
const coll = db.collection('users');

const users = await coll.find({}).toArray();
let migrated = 0;

for (const user of users) {
  if (user.password_hash) {
    console.log(`✓ SKIP ${user.email} — already hashed`);
    continue;
  }
  const rawPwd = DEMO_PASSWORDS[user.email] || user.password;
  if (!rawPwd) {
    console.log(`⚠ SKIP ${user.email} — no password found, set manually`);
    continue;
  }
  const hashed = await bcrypt.hash(rawPwd, SALT);
  await coll.updateOne(
    { _id: user._id },
    { $set: { password_hash: hashed }, $unset: { password: '' } }
  );
  console.log(`✅ ${user.email} — migrated to bcrypt`);
  migrated++;
}

console.log(`\nDone! Migrated ${migrated} user(s).`);
await client.close();
