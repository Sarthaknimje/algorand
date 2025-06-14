import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { buyTokens, sellTokens, getAllTokens, getTokenStats } from '../services/tokenService';
import { toast } from 'react-toastify';

const Trade = () => {
  const { account, connectWallet } = useWallet();
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState('buy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tokenStats, setTokenStats] = useState({});

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      const tokenList = await getAllTokens();
      setTokens(tokenList);
      
      // Load stats for each token
      const stats = {};
      for (const token of tokenList) {
        const tokenStats = await getTokenStats(token.assetId);
        stats[token.assetId] = tokenStats;
      }
      setTokenStats(stats);
    } catch (error) {
      console.error('Error loading tokens:', error);
      toast.error('Failed to load tokens');
    }
  };

  const handleTokenSelect = (token) => {
    setSelectedToken(token);
    setTradeAmount('');
    setError(null);
  };

  const handleTrade = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!selectedToken) {
      toast.error('Please select a token');
      return;
    }

    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (tradeType === 'buy') {
        const { txId, price, totalCost } = await buyTokens(
          selectedToken.assetId,
          amount,
          account
        );
        toast.success(`Successfully bought ${amount} tokens for ${totalCost} ALGO`);
        // Refresh token stats after trade
        const updatedStats = await getTokenStats(selectedToken.assetId);
        setTokenStats(prev => ({
          ...prev,
          [selectedToken.assetId]: updatedStats
        }));
      } else {
        const { txId, price, totalValue } = await sellTokens(
          selectedToken.assetId,
          amount,
          account
        );
        toast.success(`Successfully sold ${amount} tokens for ${totalValue} ALGO`);
        // Refresh token stats after trade
        const updatedStats = await getTokenStats(selectedToken.assetId);
        setTokenStats(prev => ({
          ...prev,
          [selectedToken.assetId]: updatedStats
        }));
      }
    } catch (error) {
      console.error('Trade error:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Connect Your Wallet
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Please connect your wallet to start trading tokens
            </p>
            <button
              onClick={connectWallet}
              className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Token List */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Available Tokens</h2>
              <div className="space-y-4">
                {tokens.map((token) => (
                  <motion.div
                    key={token.assetId}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg cursor-pointer ${
                      selectedToken?.assetId === token.assetId
                        ? 'bg-indigo-50 border-2 border-indigo-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleTokenSelect(token)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{token.name}</h3>
                        <p className="text-sm text-gray-500">{token.symbol}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {tokenStats[token.assetId]?.currentPrice || 'Loading...'} ALGO
                        </p>
                        <p className="text-sm text-gray-500">
                          24h Vol: {tokenStats[token.assetId]?.volume24h || '0'} ALGO
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Trading Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Trade</h2>
              {selectedToken ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Selected Token
                    </label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">{selectedToken.name}</span>
                        <span className="text-gray-500">{selectedToken.symbol}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Current Price: {tokenStats[selectedToken.assetId]?.currentPrice || 'Loading...'} ALGO</p>
                        <p>24h Volume: {tokenStats[selectedToken.assetId]?.volume24h || '0'} ALGO</p>
                        <p>Total Supply: {selectedToken.totalSupply}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trade Type
                    </label>
                    <div className="mt-1 flex space-x-4">
                      <button
                        className={`px-4 py-2 rounded-md ${
                          tradeType === 'buy'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setTradeType('buy')}
                      >
                        Buy
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md ${
                          tradeType === 'sell'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setTradeType('sell')}
                      >
                        Sell
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter amount"
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}

                  <button
                    onClick={handleTrade}
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : tradeType === 'buy'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {loading ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} Tokens`}
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  Select a token to start trading
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade; 