// Quick test to verify MongoDB connection
import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
console.log('Testing connection to:', uri.substring(0, 30) + '...');

try {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });
  
  console.log('Connecting...');
  await client.connect();
  console.log('Connected! Pinging...');
  
  const db = client.db('play_learn_grow');
  await db.command({ ping: 1 });
  console.log('✅ PING SUCCESS!');
  
  const collections = await db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));
  
  await client.close();
  console.log('Connection closed.');
} catch (e) {
  console.error('❌ Failed:', e.message);
}
