
import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "booknook";

if (!uri) {
  throw new Error("MONGODB_URI is missing from environment variables.");
}

// Reuse the MongoDB client during Next.js development.
declare global {
  var mongoClient: MongoClient | undefined;
}

const client =
  globalThis.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalThis.mongoClient = client;
}

const db: Db = client.db(dbName);

export { client, db };
