import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-dark-lighter border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EngageCoin
              </span>
              <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-md">
                Invest in influence. Trade engagement. Tokenize YouTube.
              </p>
            </motion.div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              {['About', 'Features', 'How It Works', 'FAQ', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                'Documentation',
                'API Reference',
                'Smart Contracts',
                'Terms of Service',
                'Privacy Policy'
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              © 2024 EngageCoin. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Twitter', 'GitHub', 'Discord', 'Telegram'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Made with 💚 using Algorand and AlgoKit
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 