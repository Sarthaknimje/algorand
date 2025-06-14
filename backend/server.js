const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

// Initialize database with mock data
async function initializeDB() {
  const db = client.db("creatorTokens");
  const tokensCollection = db.collection("tokens");
  const tradesCollection = db.collection("trades");

  // Check if tokens already exist
  const existingTokens = await tokensCollection.find().toArray();
  if (existingTokens.length === 0) {
    const mockTokens = [
      {
        name: "CarryMinati",
        symbol: "CARRY",
        price: 0.5,
        marketCap: 1000000,
        holders: 5000,
        volume24h: 50000,
        creator: "Ajey Nagar",
        subscribers: "40M+",
        category: "Comedy",
        description: "One of India's most popular YouTubers known for roasts and comedy content"
      },
      {
        name: "BB Ki Vines",
        symbol: "BBKV",
        price: 0.3,
        marketCap: 750000,
        holders: 3500,
        volume24h: 30000,
        creator: "Bhuvan Bam",
        subscribers: "25M+",
        category: "Comedy",
        description: "Famous for character-based comedy sketches and relatable content"
      },
      {
        name: "Technical Guruji",
        symbol: "TGURU",
        price: 0.4,
        marketCap: 900000,
        holders: 4500,
        volume24h: 40000,
        creator: "Gaurav Chaudhary",
        subscribers: "22M+",
        category: "Technology",
        description: "Leading tech reviewer and gadget expert in India"
      }
    ];

    await tokensCollection.insertMany(mockTokens);
    console.log("Initialized tokens collection");
  }
}

// API Routes
app.get('/api/tokens', async (req, res) => {
  try {
    const db = client.db("creatorTokens");
    const tokens = await db.collection("tokens").find().toArray();
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tokens/:symbol', async (req, res) => {
  try {
    const db = client.db("creatorTokens");
    const token = await db.collection("tokens").findOne({ symbol: req.params.symbol });
    if (!token) {
      return res.status(404).json({ error: "Token not found" });
    }
    res.json(token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/trades/:symbol', async (req, res) => {
  try {
    const db = client.db("creatorTokens");
    const trades = await db.collection("trades")
      .find({ symbol: req.params.symbol })
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/trades', async (req, res) => {
  try {
    const db = client.db("creatorTokens");
    const trade = {
      ...req.body,
      timestamp: new Date()
    };
    await db.collection("trades").insertOne(trade);
    res.json(trade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
connectDB().then(() => {
  initializeDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}); 