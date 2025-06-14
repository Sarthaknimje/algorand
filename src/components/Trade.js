import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { buyTokens, sellTokens, getAllTokens } from '../services/tokenService';
import { toast } from 'react-toastify';

const Trade = () => {
  const { account } = useWallet();
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState('buy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      const tokenList = await getAllTokens();
      setTokens(tokenList);
      if (tokenList.length > 0) {
        setSelectedToken(tokenList[0]);
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
      toast.error('Failed to load tokens');
    }
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

    if (!tradeAmount || tradeAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const amount = parseInt(tradeAmount);
      if (tradeType === 'buy') {
        await buyTokens(account, selectedToken.assetId, amount);
        toast.success('Tokens bought successfully!');
      } else {
        await sellTokens(account, selectedToken.assetId, amount);
        toast.success('Tokens sold successfully!');
      }

      // Refresh token data
      await loadTokens();
      setTradeAmount('');
    } catch (error) {
      console.error('Error trading tokens:', error);
      setError(error.message || 'Failed to complete trade');
      toast.error(error.message || 'Failed to complete trade');
    } finally {
      setLoading(false);
    }
  };

  const total = selectedToken ? (parseFloat(tradeAmount) || 0) * 1 : 0; // 1 ALGO per token

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Trade Tokens</h2>

          {!account ? (
            <div className="text-center text-white">
              <p className="text-lg">Please connect your wallet to start trading</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Token Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Select Token
                </label>
                <select
                  value={selectedToken?.assetId || ''}
                  onChange={(e) => {
                    const token = tokens.find(t => t.assetId === e.target.value);
                    setSelectedToken(token);
                  }}
                  className="w-full rounded-md bg-white/5 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {tokens.map((token) => (
                    <option key={token.assetId} value={token.assetId}>
                      {token.name} ({token.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Trade Type Selection */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setTradeType('buy')}
                  className={`flex-1 py-2 px-4 rounded-md ${
                    tradeType === 'buy'
                      ? 'bg-green-600 text-white'
                      : 'bg-white/10 text-gray-300'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 py-2 px-4 rounded-md ${
                    tradeType === 'sell'
                      ? 'bg-red-600 text-white'
                      : 'bg-white/10 text-gray-300'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  min="1"
                  className="w-full rounded-md bg-white/5 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter amount"
                />
              </div>

              {/* Price and Total */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between text-gray-200 mb-2">
                  <span>Price:</span>
                  <span>1 ALGO</span>
                </div>
                <div className="flex justify-between text-gray-200">
                  <span>Total:</span>
                  <span>{total} ALGO</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              {/* Trade Button */}
              <button
                onClick={handleTrade}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  tradeType === 'buy'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading
                  ? 'Processing...'
                  : tradeType === 'buy'
                  ? 'Buy Tokens'
                  : 'Sell Tokens'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trade; 