import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'token_platform';

let client;
let db;

export const connectDB = async () => {
  try {
    client = await MongoClient.connect(MONGODB_URI);
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
};

export const closeDB = async () => {
  if (client) {
    await client.close();
  }
};

// Token operations
export const saveToken = async (tokenData) => {
  const db = getDB();
  const result = await db.collection('tokens').insertOne({
    ...tokenData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return result;
};

export const getToken = async (assetId) => {
  const db = getDB();
  return await db.collection('tokens').findOne({ assetId });
};

export const getTokens = async () => {
  const db = getDB();
  return await db.collection('tokens').find().toArray();
};

export const updateToken = async (assetId, updateData) => {
  const db = getDB();
  return await db.collection('tokens').updateOne(
    { assetId },
    { 
      $set: {
        ...updateData,
        updatedAt: new Date()
      }
    }
  );
};

// Trade operations
export const saveTrade = async (tradeData) => {
  const db = getDB();
  const result = await db.collection('trades').insertOne({
    ...tradeData,
    createdAt: new Date()
  });
  return result;
};

export const getTrades = async (assetId) => {
  const db = getDB();
  return await db.collection('trades')
    .find({ assetId })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();
};

export const getTokenStats = async (assetId) => {
  const db = getDB();
  const trades = await db.collection('trades')
    .find({ assetId })
    .sort({ createdAt: -1 })
    .limit(24) // Last 24 trades
    .toArray();

  const volume24h = trades.reduce((sum, trade) => sum + trade.amount, 0);
  const priceChange = trades.length > 1 
    ? ((trades[0].price - trades[trades.length - 1].price) / trades[trades.length - 1].price) * 100
    : 0;

  return {
    volume24h,
    priceChange,
    lastPrice: trades[0]?.price || 0
  };
}; 