import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';


dotenv.config();
const uri = process.env.DATABASE_URL;
const dbName = 'Corn'; // Replace with your database name

let db: Db | null = null;

export async function connectDB(): Promise<void> {
    // @ts-ignore
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export function getDB(): Db {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}
