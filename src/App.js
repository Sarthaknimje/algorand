import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import FAQ from './components/FAQ';
import Footer from './components/Footer';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check system preference for dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-dark">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
        >
          EngageCoin
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <section id="hero">
            <Hero scrollToSection={scrollToSection} />
          </section>

          <section id="what-is-engagecoin" className="scroll-mt-20">
            <WhatIsEngageCoin />
          </section>

          <section id="how-it-works" className="scroll-mt-20">
            <HowItWorks />
          </section>

          <section id="features" className="scroll-mt-20">
            <KeyFeatures />
          </section>

          <section id="why-use-engagecoin" className="scroll-mt-20">
            <WhyUseEngageCoin />
          </section>

         

          <section id="channels" className="scroll-mt-20">
            <LiveChannels />
          </section>

          <section id="security" className="scroll-mt-20">
            <SecurityInfo />
          </section>

          <section id="token-reissuance" className="scroll-mt-20">
            <TokenReissuance />
          </section>

          <section id="faq" className="scroll-mt-20">
            <FAQ />
          </section>

          <Footer scrollToSection={scrollToSection} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App; 