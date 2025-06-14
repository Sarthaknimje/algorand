import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import ConnectWallet from './ConnectWallet';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isConnectedToPeraWallet } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-dark/80 backdrop-blur-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              EngageCoin
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            {isConnectedToPeraWallet && (
              <>
                <button
                  onClick={() => handleNavigation('/launch-token')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Launch Token
                </button>
                <button
                  onClick={() => handleNavigation('/my-tokens')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  My Tokens
                </button>
              </>
            )}
            <ConnectWallet />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: isMobileMenuOpen ? 'auto' : 0 }}
        className="md:hidden overflow-hidden bg-dark/95 backdrop-blur-lg"
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          <button
            onClick={() => handleNavigation('/')}
            className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Home
          </button>
          {isConnectedToPeraWallet && (
            <>
              <button
                onClick={() => handleNavigation('/launch-token')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Launch Token
              </button>
              <button
                onClick={() => handleNavigation('/my-tokens')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors"
              >
                My Tokens
              </button>
            </>
          )}
          <div className="px-3 py-2">
            <ConnectWallet />
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar; 