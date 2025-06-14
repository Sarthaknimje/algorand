import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createToken } from '../services/tokenService';
import { useWallet } from '../context/WalletContext';
import { toast } from 'react-toastify';

const TokenLaunch = () => {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    totalSupply: '',
    url: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      const { assetId, marketAppId, mintAppId } = await createToken(
        formData.name,
        formData.symbol,
        parseInt(formData.totalSupply),
        formData.url,
        account
      );

      toast.success('Token created and contracts set up successfully!');
      navigate(`/token/${assetId}`);
    } catch (error) {
      console.error('Error creating token:', error);
      toast.error(error.message || 'Failed to create token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Launch Your Token</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                Token Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-white/5 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., My Awesome Token"
              />
            </div>

            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-gray-200">
                Token Symbol
              </label>
              <input
                type="text"
                name="symbol"
                id="symbol"
                required
                value={formData.symbol}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-white/5 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., MAT"
              />
            </div>

            <div>
              <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-200">
                Total Supply
              </label>
              <input
                type="number"
                name="totalSupply"
                id="totalSupply"
                required
                min="1"
                value={formData.totalSupply}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-white/5 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 1000000"
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-200">
                Token URL (Optional)
              </label>
              <input
                type="url"
                name="url"
                id="url"
                value={formData.url}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-white/5 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://your-token-website.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating Token...' : 'Create Token'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TokenLaunch;