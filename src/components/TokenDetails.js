import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { 
    getTokenInfo, 
    getRecoveryStatus, 
    initiateRecovery, 
    approveRecovery, 
    completeRecovery,
    buyTokens,
    sellTokens,
    mintTokens,
    burnTokens
} from '../services/tokenService';
import { toast } from 'react-toastify';

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

// ASA IDs for each token
const ASA_IDS = {
  'TECH': '740008973',
  'BB': '740008974',
  'CAR': '740008975',
  'GAM': '740008976',
  'COOK': '740008977',
  'MUS': '740008978',
  'COM': '740008979',
  'EDU': '740008980'
};

const TokenDetails = () => {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const { account } = useWallet();
  const [timeframe, setTimeframe] = useState('24h');
  const [tradeType, setTradeType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [algoBalance, setAlgoBalance] = useState(parseFloat(localStorage.getItem('algoBalance') || '48'));
  const [ownedAmount, setOwnedAmount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [showMintSuccess, setShowMintSuccess] = useState(false);
  const [mintedAsaId, setMintedAsaId] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [recoveryStatus, setRecoveryStatus] = useState(null);
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [tradeAmount, setTradeAmount] = useState('');
  const [mintAmount, setMintAmount] = useState('');

  // Add initial price calculation
  const initialPrice = 0.10; // Base price in ALGO
  const priceMultiplier = {
    'TECH': 1.0,
    'BB': 1.2,
    'CAR': 0.8,
    'GAM': 1.5,
    'COOK': 0.9,
    'MUS': 1.1,
    'COM': 0.7,
    'EDU': 1.3
  };

  const calculatePrice = (basePrice, symbol) => {
    try {
      return (basePrice * (priceMultiplier[symbol] || 1.0)).toFixed(2);
    } catch (error) {
      console.error('Error calculating price:', error);
      return '0.00';
    }
  };

  const tokenPrice = calculatePrice(initialPrice, assetId);
  const tokenValue = (parseFloat(amount || 0) * parseFloat(tokenPrice || 0)).toFixed(2);
  const holdingsValue = (ownedAmount * parseFloat(tokenPrice || 0)).toFixed(2);

  // Mock token data
  const token = {
    name: assetId,
    category: 'Creator Token',
    price: tokenPrice,
    change24h: '5.2',
    marketCap: (parseFloat(tokenPrice) * 1000000).toLocaleString(),
    volume24h: (parseFloat(tokenPrice) * 100000).toLocaleString(),
    liquidity: (parseFloat(tokenPrice) * 500000).toLocaleString(),
    subscribers: 150000,
    views: 2500000,
    videos: 500
  };

  // Generate chart data
  useEffect(() => {
    const generateChartData = () => {
      try {
        const basePrice = parseFloat(tokenPrice || 0);
        if (isNaN(basePrice)) {
          throw new Error('Invalid base price');
        }
        return Array(7).fill(0).map(() => {
          const randomChange = (Math.random() - 0.5) * 0.1; // ±5% change
          const price = basePrice * (1 + randomChange);
          return parseFloat(price.toFixed(2));
        });
      } catch (error) {
        console.error('Error generating chart data:', error);
        setError('Failed to generate chart data');
        return Array(7).fill(0);
      }
    };

    setChartData(generateChartData());
  }, [tokenPrice]);

  useEffect(() => {
    try {
      // Load trade history from localStorage
      const history = JSON.parse(localStorage.getItem('tradeHistory') || '[]');
      const tokenHistory = history.filter(trade => trade.token === assetId);
      setTradeHistory(tokenHistory);

      // Load owned amount from localStorage
      const ownedTokens = JSON.parse(localStorage.getItem('ownedTokens') || '{}');
      setOwnedAmount(parseFloat(ownedTokens[assetId] || 0));
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
    }
  }, [assetId]);

  useEffect(() => {
    fetchTokenInfo();
  }, [assetId]);

  const fetchTokenInfo = async () => {
    try {
      setIsLoading(true);
      const [tokenResult, recoveryResult] = await Promise.all([
        getTokenInfo(assetId),
        getRecoveryStatus(assetId)
      ]);

      if (tokenResult.success) {
        setTokenInfo(tokenResult.assetInfo);
      }
      if (recoveryResult.success) {
        setRecoveryStatus(recoveryResult);
      }
    } catch (error) {
      console.error('Error fetching token info:', error);
      toast.error('Failed to fetch token information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrade = async () => {
    if (!tradeAmount || parseFloat(tradeAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setIsLoading(true);
      const result = tradeType === 'buy' 
        ? await buyTokens(account, assetId, parseFloat(tradeAmount))
        : await sellTokens(account, assetId, parseFloat(tradeAmount));

      if (result.success) {
        toast.success(`${tradeType === 'buy' ? 'Buy' : 'Sell'} successful!`);
        setTradeAmount('');
        await fetchTokenInfo();
      }
    } catch (error) {
      console.error(`Error ${tradeType}ing tokens:`, error);
      toast.error(error.message || `Failed to ${tradeType} tokens`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMint = async () => {
    if (!mintAmount || parseFloat(mintAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setIsLoading(true);
      const result = await mintTokens(account, assetId, parseFloat(mintAmount));
      if (result.success) {
        toast.success('Tokens minted successfully!');
        setMintAmount('');
        await fetchTokenInfo();
      }
    } catch (error) {
      console.error('Error minting tokens:', error);
      toast.error(error.message || 'Failed to mint tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBurn = async () => {
    if (!mintAmount || parseFloat(mintAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setIsLoading(true);
      const result = await burnTokens(account, assetId, parseFloat(mintAmount));
      if (result.success) {
        toast.success('Tokens burned successfully!');
        setMintAmount('');
        await fetchTokenInfo();
      }
    } catch (error) {
      console.error('Error burning tokens:', error);
      toast.error(error.message || 'Failed to burn tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitiateRecovery = async () => {
    try {
      setIsLoading(true);
      const result = await initiateRecovery(account, assetId);
      if (result.success) {
        toast.success('Recovery initiated successfully');
        await fetchTokenInfo();
      }
    } catch (error) {
      console.error('Error initiating recovery:', error);
      toast.error(error.message || 'Failed to initiate recovery');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRecovery = async () => {
    try {
      setIsLoading(true);
      const result = await approveRecovery(account, assetId);
      if (result.success) {
        toast.success('Recovery approved successfully');
        await fetchTokenInfo();
      }
    } catch (error) {
      console.error('Error approving recovery:', error);
      toast.error(error.message || 'Failed to approve recovery');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRecovery = async () => {
    if (!newOwnerAddress) {
      toast.error('Please enter the new owner address');
      return;
    }

    try {
      setIsLoading(true);
      const result = await completeRecovery(account, assetId, newOwnerAddress);
      if (result.success) {
        toast.success('Recovery completed successfully');
        setNewOwnerAddress('');
        await fetchTokenInfo();
      }
    } catch (error) {
      console.error('Error completing recovery:', error);
      toast.error(error.message || 'Failed to complete recovery');
    } finally {
      setIsLoading(false);
    }
  };

  if (showMintSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-green-500/20 border border-green-500 rounded-xl p-8 text-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-green-500 mb-4">Token Minted Successfully!</h2>
              <p className="text-lg text-gray-300 mb-6">Your token has been created on the Algorand blockchain</p>
              
              <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
                <p className="text-gray-400 mb-2">ASA ID</p>
                <p className="text-4xl font-mono font-bold text-green-500 mb-4">{mintedAsaId}</p>
                <p className="text-sm text-gray-400">This is your unique token identifier on the Algorand blockchain</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => navigate('/tokens')}
                  className="w-full py-3 bg-green-500 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  View Your Tokens
                </button>
                <button
                  onClick={() => setShowMintSuccess(false)}
                  className="w-full py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Mint Another Token
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xl text-red-500">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-pink-500 rounded-lg hover:bg-pink-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!tokenInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Token Not Found</h2>
          <p className="text-gray-600">The requested token could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{tokenInfo.params.name}</h1>
              <span className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full">
                {tokenInfo.params['unit-name']}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Supply</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {tokenInfo.params.total}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Creator</h3>
                <p className="mt-1 text-lg text-gray-900 break-all">
                  {tokenInfo.params.creator}
                </p>
              </div>
            </div>

            {/* Trading Section */}
            <div className="border-t border-gray-200 pt-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Trade Tokens</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() => setTradeType('buy')}
                    className={`px-4 py-2 rounded-md ${
                      tradeType === 'buy'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setTradeType('sell')}
                    className={`px-4 py-2 rounded-md ${
                      tradeType === 'sell'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Sell
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      placeholder={`Enter amount to ${tradeType}`}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    onClick={handleTrade}
                    disabled={isLoading || !tradeAmount}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} Tokens`}
                  </button>
                </div>
              </div>
            </div>

            {/* Minting Section (only for creator) */}
            {account && account.addr === tokenInfo.params.creator && (
              <div className="border-t border-gray-200 pt-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Mint/Burn Tokens</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={mintAmount}
                        onChange={(e) => setMintAmount(e.target.value)}
                        placeholder="Enter amount to mint/burn"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={handleMint}
                        disabled={isLoading || !mintAmount}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {isLoading ? 'Processing...' : 'Mint Tokens'}
                      </button>
                      <button
                        onClick={handleBurn}
                        disabled={isLoading || !mintAmount}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        {isLoading ? 'Processing...' : 'Burn Tokens'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recovery Section */}
            {recoveryStatus && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recovery Status</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        {recoveryStatus.isLocked ? 'Locked' : 'Active'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Approvals</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        {recoveryStatus.approvals} / 3
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleInitiateRecovery}
                      disabled={isLoading || recoveryStatus.isLocked}
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      Initiate Recovery
                    </button>

                    <button
                      onClick={handleApproveRecovery}
                      disabled={isLoading || !recoveryStatus.isLocked}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      Approve Recovery
                    </button>

                    {recoveryStatus.approvals >= 2 && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newOwnerAddress}
                          onChange={(e) => setNewOwnerAddress(e.target.value)}
                          placeholder="Enter new owner address"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          onClick={handleCompleteRecovery}
                          disabled={isLoading || !newOwnerAddress}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                        >
                          Complete Recovery
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails; 