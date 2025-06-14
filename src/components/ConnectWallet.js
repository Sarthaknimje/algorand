import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { QRCodeSVG } from 'qrcode.react';

const ConnectWallet = ({ className = "", buttonText = "Connect Wallet" }) => {
  const { isConnectedToPeraWallet, address, connectWallet, disconnectWallet } = useWallet();
  const [showQR, setShowQR] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setShowQR(true);
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setShowQR(false);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
      setShowQR(false);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <>
      {!isConnectedToPeraWallet ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleConnectWallet}
          className={`px-6 py-2 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent text-white font-medium transition-all duration-300 ${className}`}
        >
          {buttonText}
        </motion.button>
      ) : (
        <div className="flex items-center space-x-4">
          <div className="text-white font-mono text-sm bg-white/10 px-4 py-2 rounded-lg">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDisconnectWallet}
            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 font-medium transition-all duration-300"
          >
            Disconnect
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {showQR && !isConnectedToPeraWallet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark p-8 rounded-2xl border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4">Connect Pera Wallet</h3>
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG value="pera://" size={200} />
              </div>
              <p className="text-gray-400 mt-4 text-center">Scan with Pera Wallet to connect</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQR(false)}
                className="mt-4 w-full px-4 py-2 rounded-lg bg-white/10 text-white font-medium transition-all duration-300"
              >
                Cancel
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ConnectWallet; 