import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { 
  ArrowPathIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const MyTokens = () => {
  const { isConnectedToPeraWallet, address } = useWallet();
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isConnectedToPeraWallet) {
      fetchTokens();
    }
  }, [isConnectedToPeraWallet]);

  const fetchTokens = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual token fetching from Algorand blockchain
      // This is a placeholder for the actual implementation
      const mockTokens = [
        {
          id: 1,
          name: "CreatorCoin",
          symbol: "CRTR",
          totalSupply: "1,000,000",
          currentPrice: "0.15 ALGO",
          marketCap: "150,000 ALGO",
          holders: "250",
          channelName: "My YouTube Channel",
          channelSubscribers: "10K",
          thumbnail: "https://i.pravatar.cc/150?img=1"
        },
        {
          id: 2,
          name: "GamingToken",
          symbol: "GAME",
          totalSupply: "2,000,000",
          currentPrice: "0.08 ALGO",
          marketCap: "160,000 ALGO",
          holders: "500",
          channelName: "Gaming Channel",
          channelSubscribers: "25K",
          thumbnail: "https://i.pravatar.cc/150?img=2"
        }
      ];
      setTokens(mockTokens);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnectedToPeraWallet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark via-dark-lighter to-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet First</h2>
          <p className="text-gray-300 mb-8">Please connect your Pera Wallet to view your tokens.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-dark-lighter to-dark py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">My Tokens</h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchTokens}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-white/5 text-white font-medium transition-all duration-300 hover:bg-white/10 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center">
                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                Refreshing...
              </div>
            ) : (
              "Refresh"
            )}
          </motion.button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <ArrowPathIcon className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Loading your tokens...</p>
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-4">No Tokens Found</h3>
            <p className="text-gray-300 mb-8">You haven't created any tokens yet.</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '#launch-token'}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent text-white font-medium transition-all duration-300"
            >
              Launch Your First Token
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens.map((token) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={token.thumbnail}
                    alt={token.channelName}
                    className="w-16 h-16 rounded-full border-2 border-primary"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-white">{token.name}</h3>
                    <p className="text-gray-300">{token.channelName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CurrencyDollarIcon className="w-5 h-5 text-primary" />
                      <span className="text-sm text-gray-300">Price</span>
                    </div>
                    <p className="text-lg font-semibold text-white">{token.currentPrice}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <ChartBarIcon className="w-5 h-5 text-primary" />
                      <span className="text-sm text-gray-300">Market Cap</span>
                    </div>
                    <p className="text-lg font-semibold text-white">{token.marketCap}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <UserGroupIcon className="w-5 h-5 text-primary" />
                      <span className="text-sm text-gray-300">Holders</span>
                    </div>
                    <p className="text-lg font-semibold text-white">{token.holders}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CurrencyDollarIcon className="w-5 h-5 text-primary" />
                      <span className="text-sm text-gray-300">Supply</span>
                    </div>
                    <p className="text-lg font-semibold text-white">{token.totalSupply}</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-white font-medium transition-all duration-300 hover:bg-white/10"
                  >
                    View Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent text-white font-medium transition-all duration-300"
                  >
                    Trade
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTokens; 