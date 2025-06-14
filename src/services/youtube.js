const API_KEY = 'AIzaSyBYVrcI-3CGBzVQplilpDT0oEmjL7Xl5gk';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Popular Indian YouTubers with real channel IDs
export const INDIAN_CREATORS = {
  'TECH': {
    id: 'UCc1Pn7FxieMohCZFPYEbs7w', // Technical Guruji
    name: 'Technical Guruji',
    symbol: 'TECH',
    category: 'Technology',
  },
  'BB': {
    id: 'UCX6OQ3DkcsbYNE6H8uQQuVA', // MrBeast
    name: 'MrBeast',
    symbol: 'BB',
    category: 'Entertainment',
  },
  'CAR': {
    id: 'UC0HKS6-wlzQ9jZVS7zX9weg', // Shmee150
    name: 'Shmee150',
    symbol: 'CAR',
    category: 'Automotive',
  },
  'GAM': {
    id: 'UCJ5v_MCY6GNUBTO8-D3XoAg', // Total Gaming
    name: 'Total Gaming',
    symbol: 'GAM',
    category: 'Gaming',
  },
  'COOK': {
    id: 'UCqZ8IpRdoyQJR5uC9z9dpEQ', // Sanjeev Kapoor
    name: 'Sanjeev Kapoor',
    symbol: 'COOK',
    category: 'Cooking',
  },
  'MUS': {
    id: 'UC-9-kyTW8ZkZNDHQJ6FgpwQ', // T-Series
    name: 'T-Series',
    symbol: 'MUS',
    category: 'Music',
  },
  'COM': {
    id: 'UC3NwWUzD9VM3Ya-Ktj5zqJA', // CarryMinati
    name: 'CarryMinati',
    symbol: 'COM',
    category: 'Comedy',
  },
  'EDU': {
    id: 'UCiT9RITQ9PW6BhXK0y2jaeg', // Khan Academy
    name: 'Khan Academy',
    symbol: 'EDU',
    category: 'Education',
  }
};

export const fetchChannelStats = async (channelId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/channels?part=statistics,snippet,brandingSettings&id=${channelId}&key=${API_KEY}`
    );
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const channel = data.items[0];
      return {
        id: channelId,
        name: channel.snippet.title,
        description: channel.snippet.description,
        subscribers: parseInt(channel.statistics.subscriberCount) || 0,
        views: parseInt(channel.statistics.viewCount) || 0,
        videos: parseInt(channel.statistics.videoCount) || 0,
        thumbnail: channel.snippet.thumbnails.high.url,
        banner: channel.brandingSettings.image?.bannerExternalUrl || null,
        country: 'India',
        publishedAt: channel.snippet.publishedAt,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching channel stats:', error);
    return null;
  }
};

export const fetchAllIndianCreators = async () => {
  try {
    const channelsPromises = Object.entries(INDIAN_CREATORS).map(([symbol, creator]) =>
      fetchChannelStats(creator.id).then(stats => ({
        ...stats,
        symbol,
        category: creator.category,
        displayName: creator.name,
      }))
    );
    
    const channels = await Promise.all(channelsPromises);
    return channels.filter(channel => channel !== null);
  } catch (error) {
    console.error('Error fetching Indian creators:', error);
    return [];
  }
};

// Helper function to calculate token metrics based on real data
export const calculateTokenMetrics = (channel) => {
  // Base price calculation using real metrics
  const basePrice = 0.1;
  const subscriberMultiplier = 0.0000001;
  const viewMultiplier = 0.00000001;
  const videoMultiplier = 0.0001;
  
  // Calculate price based on channel metrics
  const price = (
    basePrice + 
    (channel.subscribers * subscriberMultiplier) + 
    (channel.views * viewMultiplier) +
    (channel.videos * videoMultiplier)
  ).toFixed(2);

  // Calculate market cap based on price and subscribers
  const marketCap = (parseFloat(price) * channel.subscribers).toFixed(2);
  
  // Calculate volume based on views and price
  const volume24h = (parseFloat(price) * channel.views * 0.01).toFixed(2);
  
  // Calculate liquidity based on market cap
  const liquidity = (parseFloat(marketCap) * 0.05).toFixed(2);
  
  // Generate realistic price change
  const change24h = (Math.random() * 10 - 5).toFixed(1);
  
  // Generate price chart data
  const chart = Array(7).fill(0).map(() => {
    const basePrice = parseFloat(price);
    const variation = basePrice * 0.1; // 10% variation
    return (basePrice + (Math.random() * variation * 2 - variation)).toFixed(2);
  });

  return {
    price,
    marketCap,
    volume24h,
    liquidity,
    change24h,
    chart,
  };
}; 