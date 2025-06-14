import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const port = 5000;

// MongoDB connection
const mongoUrl = 'mongodb://localhost:27017/hack';
const client = new MongoClient(mongoUrl);

app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

connectToDatabase();

// Token creation endpoint
app.post('/api/tokens', async (req, res) => {
  try {
    const { name, symbol, totalSupply, initialPrice, description, youtubeChannel, creatorAddress } = req.body;
    
    // Create token in database
    const db = client.db('hack');
    const tokensCollection = db.collection('tokens');
    
    const token = {
      name,
      symbol,
      totalSupply,
      initialPrice,
      description,
      youtubeChannel,
      creatorAddress,
      createdAt: new Date(),
      asaId: Math.floor(Math.random() * 1000000), // Mock ASA ID for now
    };
    
    await tokensCollection.insertOne(token);
    
    res.json({ success: true, token });
  } catch (error) {
    console.error('Error creating token:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's tokens
app.get('/api/tokens/my/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const db = client.db('hack');
    const tokensCollection = db.collection('tokens');
    
    const tokens = await tokensCollection.find({ creatorAddress: address }).toArray();
    res.json(tokens);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 