import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { Link } from 'react-router-dom';

const TradeTokens = () => {
  const [selectedToken, setSelectedToken] = useState(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, tech, gaming, etc.
  const [tradeHistory, setTradeHistory] = useState([]);
  const [algoBalance, setAlgoBalance] = useState(48); // Initial ALGO balance
  const [tradeType, setTradeType] = useState('buy'); // 'buy' or 'sell'
  const [ownedTokens, setOwnedTokens] = useState({}); // Track owned tokens

  useEffect(() => {
    const loadTokens = async () => {
      setIsLoadingTokens(true);
      try {
        const creators = await fetchAllIndianCreators();
        const formattedTokens = creators.map(creator => {
          const metrics = calculateTokenMetrics(creator);
          return {
            ...creator,
            ...metrics,
            name: creator.displayName,
            symbol: creator.symbol,
            price: metrics.price || '0.00',
            marketCap: metrics.marketCap || '0',
            liquidity: metrics.liquidity || '0',
            volume24h: metrics.volume24h || '0',
            change24h: metrics.change24h || '0.0',
            subscribers: creator.subscribers || 0,
            videos: creator.videos || 0,
            views: creator.views || 0,
          };
        });
        setTokens(formattedTokens);
      } catch (error) {
        console.error('Error loading tokens:', error);
        setTokens([]);
      } finally {
        setIsLoadingTokens(false);
      }
    };

    loadTokens();
  }, []);

  const handleTrade = async () => {
    if (!selectedToken || !amount) return;
    
    const tradeAmount = parseFloat(amount);
    const tokenPrice = parseFloat(selectedToken.price);
    const totalCost = tradeAmount * tokenPrice;

    if (tradeType === 'buy') {
      // Check if user has enough ALGO balance for buying
      if (totalCost > algoBalance) {
        alert('Insufficient ALGO balance');
        return;
      }
    } else {
      // Check if user has enough tokens for selling
      const ownedAmount = ownedTokens[selectedToken.symbol] || 0;
      if (tradeAmount > ownedAmount) {
        alert('Insufficient token balance');
        return;
      }
    }

    setIsLoading(true);
    try {
      // Simulate trade
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update balances
      if (tradeType === 'buy') {
        setAlgoBalance(prev => prev - totalCost);
        setOwnedTokens(prev => ({
          ...prev,
          [selectedToken.symbol]: (prev[selectedToken.symbol] || 0) + tradeAmount
        }));
      } else {
        setAlgoBalance(prev => prev + totalCost);
        setOwnedTokens(prev => ({
          ...prev,
          [selectedToken.symbol]: prev[selectedToken.symbol] - tradeAmount
        }));
      }
      
      // Save to localStorage
      localStorage.setItem('algoBalance', algoBalance.toString());
      localStorage.setItem('ownedTokens', JSON.stringify(ownedTokens));
      
      // Add to trade history
      const newTrade = {
        id: Date.now(),
        token: selectedToken.symbol,
        amount: tradeAmount,
        price: tokenPrice,
        total: totalCost,
        timestamp: new Date().toISOString(),
        type: tradeType,
        algoBalance: tradeType === 'buy' ? algoBalance - totalCost : algoBalance + totalCost,
        tokenBalance: tradeType === 'buy' 
          ? (ownedTokens[selectedToken.symbol] || 0) + tradeAmount
          : (ownedTokens[selectedToken.symbol] || 0) - tradeAmount
      };
      
      // Save trade history to localStorage
      const tradeHistory = JSON.parse(localStorage.getItem('tradeHistory') || '[]');
      tradeHistory.unshift(newTrade);
      localStorage.setItem('tradeHistory', JSON.stringify(tradeHistory));
      
      setTradeHistory(prev => [newTrade, ...prev]);
      setShowSuccess(true);
      setAmount('');
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Trade failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (value) => {
    if (value === undefined || value === null) return '0';
    return typeof value === 'number' ? value.toLocaleString() : value;
  };

  const filteredTokens = activeTab === 'all' 
    ? tokens 
    : tokens.filter(token => token.category.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Creator Token Market</h1>
              <p className="text-gray-400">Trade tokens of your favorite Indian creators</p>
            </div>
            <div className="flex space-x-4">
              <div className="px-4 py-2 bg-gray-800 rounded-lg">
                <span className="text-gray-400 mr-2">Balance:</span>
                <span className="font-semibold">{algoBalance.toFixed(2)} ALGO</span>
              </div>
              <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <ChartBarIcon className="w-5 h-5 inline-block mr-2" />
                Market Overview
              </button>
              <button className="px-4 py-2 bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors">
                <CurrencyDollarIcon className="w-5 h-5 inline-block mr-2" />
                Trade History
              </button>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Token List */}
            <div className="lg:col-span-2 space-y-4">
              {isLoadingTokens ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                  <p className="mt-4 text-gray-400">Loading creator tokens...</p>
                </div>
              ) : (
                filteredTokens.map((token) => (
                  <motion.div
                    key={token.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedToken(token)}
                    className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all ${
                      selectedToken?.id === token.id ? 'ring-2 ring-pink-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Link to={`/token/${token.symbol}`} className="text-xl font-semibold hover:text-pink-500">
                          {token.name}
                        </Link>
                        <p className="text-gray-400">{token.category}</p>
                        {ownedTokens[token.symbol] > 0 && (
                          <p className="text-sm text-green-500 mt-1">
                            Owned: {ownedTokens[token.symbol].toFixed(2)} tokens
                          </p>
                        )}
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
                    <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
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
                        <span>${formatNumber(token.marketCap)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Trading Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 sticky top-8">
                <h2 className="text-2xl font-semibold mb-6">Trade</h2>
                {selectedToken ? (
                  <>
                    <div className="mb-6">
                      <div className="mb-4">
                        <h3 className="font-semibold">{selectedToken.name}</h3>
                        <p className="text-gray-400">{selectedToken.category}</p>
                        {ownedTokens[selectedToken.symbol] > 0 && (
                          <p className="text-sm text-green-500 mt-1">
                            Owned: {ownedTokens[selectedToken.symbol].toFixed(2)} tokens
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Price</p>
                          <p className="text-xl font-semibold">${selectedToken.price}</p>
                          <p className={`${
                            parseFloat(selectedToken.change24h) >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {parseFloat(selectedToken.change24h) >= 0 ? '+' : ''}{selectedToken.change24h}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Market Cap</p>
                          <p className="text-xl font-semibold">${formatNumber(selectedToken.marketCap)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setTradeType('buy')}
                          className={`py-2 rounded-lg transition-colors ${
                            tradeType === 'buy' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-700 text-gray-400'
                          }`}
                        >
                          Buy
                        </button>
                        <button
                          onClick={() => setTradeType('sell')}
                          className={`py-2 rounded-lg transition-colors ${
                            tradeType === 'sell' 
                              ? 'bg-red-500 text-white' 
                              : 'bg-gray-700 text-gray-400'
                          }`}
                        >
                          Sell
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Amount (ALGO)
                        </label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="Enter amount in ALGO"
                        />
                      </div>

                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <p className="text-gray-400">Total Value</p>
                        <p className="text-xl font-semibold">
                          ${(parseFloat(amount || 0) * parseFloat(selectedToken.price)).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Available Balance: {tradeType === 'buy' 
                            ? `${algoBalance.toFixed(2)} ALGO`
                            : `${ownedTokens[selectedToken.symbol] || 0} tokens`
                          }
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleTrade}
                        disabled={isLoading || !amount || (
                          tradeType === 'buy' 
                            ? parseFloat(amount) * parseFloat(selectedToken.price) > algoBalance
                            : parseFloat(amount) > (ownedTokens[selectedToken.symbol] || 0)
                        )}
                        className={`w-full py-3 rounded-lg font-medium transition-colors ${
                          tradeType === 'buy' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-red-600 hover:bg-red-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isLoading ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} Now`}
                      </motion.button>

                      {showSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-green-500 text-center"
                        >
                          {tradeType === 'buy' ? 'Purchase' : 'Sale'} successful!
                        </motion.div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    Select a token to start trading
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Trade History */}
          {tradeHistory.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Recent Trades</h2>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ALGO Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {tradeHistory.map((trade) => (
                      <tr key={trade.id} className="hover:bg-gray-700/30">
                        <td className="px-6 py-4 whitespace-nowrap">{trade.token}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            trade.type === 'buy' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                          }`}>
                            {trade.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{trade.amount} ALGO</td>
                        <td className="px-6 py-4 whitespace-nowrap">${trade.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${trade.total.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{trade.algoBalance.toFixed(2)} ALGO</td>
                        <td className="px-6 py-4 whitespace-nowrap">{trade.tokenBalance.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                          {new Date(trade.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeTokens; 