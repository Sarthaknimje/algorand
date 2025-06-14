import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UserCircleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  VideoCameraIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { fetchAllIndianCreators, calculateTokenMetrics } from '../services/youtube';

const MyTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const loadTokens = async () => {
      setIsLoading(true);
      try {
        const creators = await fetchAllIndianCreators();
        const formattedTokens = creators.map(creator => {
          const metrics = calculateTokenMetrics(creator);
          return {
            ...creator,
            ...metrics,
            name: `${creator.symbol} [${creator.displayName}]`,
            // Ensure all numeric values have defaults
            subscribers: creator.subscribers || 0,
            videos: creator.videos || 0,
            views: creator.views || 0,
            price: metrics.price || '0.00',
            marketCap: metrics.marketCap || '0',
            liquidity: metrics.liquidity || '0',
            volume24h: metrics.volume24h || '0',
            change24h: metrics.change24h || '0.0',
          };
        });
        setTokens(formattedTokens);
      } catch (error) {
        console.error('Error loading tokens:', error);
        setTokens([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTokens();
  }, []);

  const filteredTokens = activeTab === 'all' 
    ? tokens 
    : tokens.filter(token => token.category.toLowerCase() === activeTab.toLowerCase());

  const formatNumber = (value) => {
    if (value === undefined || value === null) return '0';
    return typeof value === 'number' ? value.toLocaleString() : value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Creator Tokens</h1>
              <p className="text-gray-400">Manage and trade your creator tokens</p>
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <ChartBarIcon className="w-5 h-5 inline-block mr-2" />
                Portfolio Overview
              </button>
              <Link
                to="/trade"
                className="px-4 py-2 bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
              >
                <CurrencyDollarIcon className="w-5 h-5 inline-block mr-2" />
                Trade Tokens
              </Link>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'all' ? 'bg-pink-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {['Technology', 'Gaming', 'Entertainment', 'Music', 'Comedy', 'Education', 'Cooking'].map(category => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === category.toLowerCase() ? 'bg-pink-600' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading your tokens...</p>
            </div>
          ) : tokens.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No tokens found. Start trading to see your tokens here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredTokens.map((token) => (
                <motion.div
                  key={token.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={token.thumbnail}
                      alt={token.name}
                      className="w-16 h-16 rounded-full border-2 border-pink-500"
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold">{token.name}</h3>
                      <p className="text-gray-400">{token.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold">${token.price}</p>
                      <p className={`${
                        parseFloat(token.change24h) >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {parseFloat(token.change24h) >= 0 ? '+' : ''}{token.change24h}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-gray-400">Market Cap</p>
                      <p className="text-xl font-semibold">${formatNumber(token.marketCap)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Liquidity</p>
                      <p className="text-xl font-semibold">${formatNumber(token.liquidity)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
                    <div className="flex items-center">
                      <UserGroupIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{formatNumber(token.subscribers)}</span>
                    </div>
                    <div className="flex items-center">
                      <VideoCameraIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{formatNumber(token.videos)}</span>
                    </div>
                    <div className="flex items-center">
                      <EyeIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{formatNumber(token.views)}</span>
                    </div>
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span>${formatNumber(token.volume24h)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Link
                      to={`/token/${token.symbol}`}
                      className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-center rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      to="/trade"
                      className="flex-1 py-2 bg-pink-600 hover:bg-pink-700 text-center rounded-lg transition-colors"
                    >
                      Trade
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTokens; 