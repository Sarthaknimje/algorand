import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchAllIndianCreators } from '../services/youtube';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Portfolio = () => {
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [selectedToken, setSelectedToken] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const creators = await fetchAllIndianCreators();
        // Get owned tokens from localStorage
        const ownedTokens = JSON.parse(localStorage.getItem('ownedTokens') || '{}');
        
        // Filter tokens that are owned
        const ownedCreators = creators.filter(creator => ownedTokens[creator.symbol] > 0);
        
        // Calculate total value
        const total = ownedCreators.reduce((sum, creator) => {
          return sum + (ownedTokens[creator.symbol] * parseFloat(creator.price));
        }, 0);
        
        setTokens(ownedCreators);
        setTotalValue(total);
      } catch (error) {
        console.error('Error loading portfolio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTokens();
  }, []);

  const handleViewDetails = (token) => {
    setSelectedToken(token);
    setShowDetails(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (showDetails && selectedToken) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
        <button
          onClick={() => setShowDetails(false)}
          className="mb-6 flex items-center text-gray-400 hover:text-white"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Portfolio
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-6">{selectedToken.name} Details</h2>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-gray-400">Current Price</p>
                  <p className="text-2xl font-semibold">${selectedToken.price}</p>
                  <p className={`${
                    parseFloat(selectedToken.change24h) >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {parseFloat(selectedToken.change24h) >= 0 ? '+' : ''}{selectedToken.change24h}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Market Cap</p>
                  <p className="text-2xl font-semibold">${selectedToken.marketCap}</p>
                </div>
              </div>

              <div className="h-80">
                <Line
                  data={{
                    labels: Array(7).fill('').map((_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (6 - i));
                      return date.toLocaleDateString();
                    }),
                    datasets: [{
                      label: 'Price History',
                      data: selectedToken.chart,
                      borderColor: 'rgb(236, 72, 153)',
                      tension: 0.4,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)'
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Token Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400">Category</p>
                  <p className="font-medium">{selectedToken.category}</p>
                </div>
                <div>
                  <p className="text-gray-400">Subscribers</p>
                  <p className="font-medium">{selectedToken.subscribers.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Views</p>
                  <p className="font-medium">{selectedToken.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Videos</p>
                  <p className="font-medium">{selectedToken.videos.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">24h Volume</p>
                  <p className="font-medium">${selectedToken.volume24h}</p>
                </div>
                <div>
                  <p className="text-gray-400">Liquidity</p>
                  <p className="font-medium">${selectedToken.liquidity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Portfolio Overview</h1>
          <p className="text-gray-400">Track your creator token investments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-gray-400 mb-2">Total Portfolio Value</h3>
            <p className="text-3xl font-bold">${totalValue.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-gray-400 mb-2">Number of Tokens</h3>
            <p className="text-3xl font-bold">{tokens.length}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-gray-400 mb-2">ALGO Balance</h3>
            <p className="text-3xl font-bold">
              {parseFloat(localStorage.getItem('algoBalance') || '48').toFixed(2)} ALGO
            </p>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">24h Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {tokens.map((token) => {
                const ownedAmount = JSON.parse(localStorage.getItem('ownedTokens') || '{}')[token.symbol] || 0;
                const value = ownedAmount * parseFloat(token.price);
                
                return (
                  <tr key={token.id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium">{token.name}</p>
                        <p className="text-sm text-gray-400">{token.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{ownedAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${token.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${value.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`${
                        parseFloat(token.change24h) >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {parseFloat(token.change24h) >= 0 ? '+' : ''}{token.change24h}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(token)}
                        className="text-pink-500 hover:text-pink-400"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio; 