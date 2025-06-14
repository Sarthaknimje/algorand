import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { createToken, signAndSendTransaction } from '../services/tokenService';
import { 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  ArrowPathIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const TokenLaunch = () => {
  const { isConnectedToPeraWallet, address, peraWallet } = useWallet();
  const { 
    isGoogleAuthenticated, 
    youtubeChannel, 
    loading: googleLoading, 
    error: googleError,
    handleGoogleLogin,
    handleLogout 
  } = useGoogleAuth();

  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    totalSupply: '',
    initialPrice: '',
    description: '',
    channelId: '',
    channelName: '',
    channelUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [txId, setTxId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConnectedToPeraWallet) {
      setError('Please connect your Pera Wallet first');
      return;
    }
    if (!isGoogleAuthenticated || !youtubeChannel) {
      setError('Please connect your YouTube channel first');
      return;
    }
    if (formData.channelId !== youtubeChannel.id) {
      setError('You can only mint tokens for your own YouTube channel');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Validate form data
      if (!formData.tokenName || !formData.tokenSymbol || !formData.totalSupply || !formData.initialPrice) {
        throw new Error('Please fill in all required fields');
      }

      if (isNaN(parseInt(formData.totalSupply)) || parseInt(formData.totalSupply) <= 0) {
        throw new Error('Total supply must be a positive number');
      }

      if (isNaN(parseFloat(formData.initialPrice)) || parseFloat(formData.initialPrice) <= 0) {
        throw new Error('Initial price must be a positive number');
      }

      // Create token transaction
      const txn = await createToken({
        creatorAddress: address,
        tokenName: formData.tokenName,
        tokenSymbol: formData.tokenSymbol,
        totalSupply: parseInt(formData.totalSupply),
        url: formData.channelUrl,
        metadataHash: {
          description: formData.description,
          channelId: formData.channelId,
          channelName: formData.channelName,
          initialPrice: formData.initialPrice
        }
      });

      // Sign and send transaction
      const confirmedTxn = await signAndSendTransaction(txn, peraWallet);
      setTxId(confirmedTxn.txId);
      
      setSuccess(true);
      setFormData({
        tokenName: '',
        tokenSymbol: '',
        totalSupply: '',
        initialPrice: '',
        description: '',
        channelId: '',
        channelName: '',
        channelUrl: ''
      });
    } catch (err) {
      console.error('Token launch error:', err);
      setError(err.message || 'Failed to launch token');
    } finally {
      setLoading(false);
    }
  };

  const handleChannelSelect = () => {
    if (youtubeChannel) {
      setFormData(prev => ({
        ...prev,
        channelId: youtubeChannel.id,
        channelName: youtubeChannel.title,
        channelUrl: `https://youtube.com/channel/${youtubeChannel.id}`
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Launch Your Channel Token
          </h1>
          <p className="text-gray-400">
            Create and launch your own token for your YouTube channel
          </p>
        </motion.div>

        {!isConnectedToPeraWallet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8"
          >
            <div className="flex items-center gap-3">
              <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
              <p className="text-red-500">Please connect your Pera Wallet to continue</p>
            </div>
          </motion.div>
        )}

        {!isGoogleAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8"
          >
            <div className="flex items-center gap-3">
              <ExclamationCircleIcon className="w-6 h-6 text-blue-500" />
              <p className="text-blue-500">Please connect your YouTube channel to continue</p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Token Name
                </label>
                <input
                  type="text"
                  name="tokenName"
                  value={formData.tokenName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Channel Token"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Token Symbol
                </label>
                <input
                  type="text"
                  name="tokenSymbol"
                  value={formData.tokenSymbol}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., CHT"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Total Supply
                </label>
                <input
                  type="number"
                  name="totalSupply"
                  value={formData.totalSupply}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 1000000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Initial Price (ALGO)
                </label>
                <input
                  type="number"
                  name="initialPrice"
                  value={formData.initialPrice}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 0.1"
                  step="0.000001"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
                placeholder="Describe your token..."
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-400">
                  YouTube Channel
                </label>
                {!isGoogleAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    {googleLoading ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm6.605 16.51c-.35.35-.92.35-1.27 0l-4.335-4.335c-.35-.35-.35-.92 0-1.27.35-.35.92-.35 1.27 0l4.335 4.335c.35.35.35.92 0 1.27zm-6.605-6.605c-.35-.35-.35-.92 0-1.27.35-.35.92-.35 1.27 0l4.335 4.335c.35.35.35.92 0 1.27-.35.35-.92.35-1.27 0l-4.335-4.335z"/>
                        </svg>
                        Connect YouTube
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Disconnect
                  </button>
                )}
              </div>

              {youtubeChannel && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={youtubeChannel.thumbnailUrl}
                      alt={youtubeChannel.title}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-white">{youtubeChannel.title}</h3>
                      <p className="text-sm text-gray-400">
                        {youtubeChannel.subscriberCount} subscribers • {youtubeChannel.videoCount} videos
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-500">Token launched successfully!</p>
                {txId && (
                  <p className="text-green-400 text-sm mt-2">
                    Transaction ID: <a href={`https://testnet.algoexplorer.io/tx/${txId}`} target="_blank" rel="noopener noreferrer" className="underline">{txId}</a>
                  </p>
                )}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !isConnectedToPeraWallet || !isGoogleAuthenticated}
              className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors ${
                loading || !isConnectedToPeraWallet || !isGoogleAuthenticated
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  Launching Token...
                </div>
              ) : (
                'Launch Token'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default TokenLaunch; 