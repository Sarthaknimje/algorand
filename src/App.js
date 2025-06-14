import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { GoogleAuthProvider } from './context/GoogleAuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatIsEngageCoin from './components/WhatIsEngageCoin';
import WhyUseEngageCoin from './components/WhyUseEngageCoin';
import HowItWorks from './components/HowItWorks';
import KeyFeatures from './components/KeyFeatures';
import UseCases from './components/UseCases';
import LiveChannels from './components/LiveChannels';
import SecurityInfo from './components/SecurityInfo';
import TokenReissuance from './components/TokenReissuance';
import Tokenomics from './components/Tokenomics';
import Roadmap from './components/Roadmap';
import TokenLaunch from './components/TokenLaunch';
import MyTokens from './components/MyTokens';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import TradeTokens from './components/TradeTokens';
import Portfolio from './components/Portfolio';
import TokenDetails from './components/TokenDetails';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-white">Creator Tokens</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className={`${
                    location.pathname === '/'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Trade
                </Link>
                <Link
                  to="/portfolio"
                  className={`${
                    location.pathname === '/portfolio'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <WalletProvider>
        <GoogleAuthProvider>
          <div className="min-h-screen bg-dark text-white">
            <Navbar />
            <main className="pt-16"> {/* Add padding-top to account for fixed navbar */}
              <Routes>
                <Route path="/" element={
                  <>
                    <Hero />
                    <WhatIsEngageCoin />
                    <WhyUseEngageCoin />
                    <LiveChannels />
                    <SecurityInfo />
                    <TokenReissuance />
                    <Tokenomics />
                    <Roadmap />
                  </>
                } />
                <Route path="/launch-token" element={<TokenLaunch />} />
                <Route path="/my-tokens" element={<MyTokens />} />
                <Route path="/trade" element={<TradeTokens />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/token/:symbol" element={<TokenDetails />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </GoogleAuthProvider>
      </WalletProvider>
    </Router>
  );
}

export default App; 