/**
 * migrate-all-passwords.mjs
 * Migrates ALL users (students, teachers, admins, parents) 
 * from plaintext passwords to bcrypt hashes.
 * 
 * Run: node server/migrate-all-passwords.mjs
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const SALT_ROUNDS = 12;
const DEFAULT_PASS = 'student123'; // fallback if no password found

async function migrateAllPasswords() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('❌ MONGODB_URI missing in .env'); process.exit(1); }

  console.log('🔄 Connecting to MongoDB...');
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  await client.connect();
  const db = client.db(process.env.DB_NAME || 'play_learn_grow');
  const users = db.collection('users');

  console.log('🔍 Fetching all users...');
  const allUsers = await users.find({}).toArray();
  console.log(`📊 Total users found: ${allUsers.length}`);

  let migrated = 0;
  let skipped  = 0;
  let errors   = 0;

  for (const user of allUsers) {
    try {
      // Already has a proper bcrypt hash → skip
      if (user.password_hash && user.password_hash.startsWith('$2')) {
        skipped++;
        process.stdout.write('·');
        continue;
      }

      // Determine plaintext password to hash
      const plaintext = user.password || user.pass || DEFAULT_PASS;

      const hash = await bcrypt.hash(plaintext, SALT_ROUNDS);

      await users.updateOne(
        { _id: user._id },
        {
          $set:   { password_hash: hash },
          $unset: { password: '', pass: '' },
        }
      );

      migrated++;
      process.stdout.write('✅');
    } catch (err) {
      errors++;
      console.error(`\n❌ Error migrating user ${user.email || user._id}: ${err.message}`);
    }
  }

  console.log('\n\n────────────────────────────────');
  console.log(`✅ Migrated:  ${migrated} users`);
  console.log(`⏭️  Skipped:  ${skipped} (already hashed)`);
  console.log(`❌ Errors:    ${errors}`);
  console.log('────────────────────────────────');
  console.log('🎉 Migration complete!');

  await client.close();
}

migrateAllPasswords().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
