import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
                <Route path="*" element={<Navigate to="/" replace />} />
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