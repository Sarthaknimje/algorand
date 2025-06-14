import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    question: "How are token prices decided?",
    answer: "Token prices are determined by a combination of factors including YouTube engagement metrics (views, likes, subscribers), market demand, and trading volume. The price automatically adjusts based on these factors using our smart contract algorithms."
  },
  {
    question: "What happens if a channel is deleted?",
    answer: "If a YouTube channel is deleted, the associated tokens will be frozen. Holders can either wait for the channel to be restored or participate in a community vote to determine the future of the tokens. This ensures fair treatment for all token holders."
  },
  {
    question: "Can I cash out my tokens?",
    answer: "Yes, you can sell your tokens at any time through our platform. The tokens are traded in ALGO, which you can then convert to other cryptocurrencies or fiat currency through various exchanges."
  },
  {
    question: "What if I lose my wallet?",
    answer: "We offer a secure token reissuance process. You can verify your identity through YouTube OAuth or your pre-registered wallet ID hash to recover your tokens. This process is limited to once per wallet per creator to prevent abuse."
  },
  {
    question: "Do creators get revenue?",
    answer: "Yes, creators receive a percentage of the trading fees and can also benefit from the initial token sale. This creates a sustainable revenue stream beyond traditional YouTube monetization."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const slideInLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const slideInRight = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-dark via-dark-lighter to-dark overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div
            variants={slideInLeft}
            className="inline-block p-1 rounded-full bg-gradient-to-r from-primary via-secondary to-accent mb-8"
          >
            <div className="px-4 py-1 rounded-full bg-dark text-white text-sm font-medium">
              Common Questions
            </div>
          </motion.div>

          <motion.h2
            variants={containerVariants}
            className="text-4xl font-bold mb-4"
          >
            <motion.span
              variants={slideInLeft}
              className="block text-white mb-2 font-light italic"
            >
              Frequently Asked
            </motion.span>
            <motion.span
              variants={slideInRight}
              className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient font-black"
            >
              Questions
            </motion.span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto font-light"
          >
            Everything you need to know about EngageCoin
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="mb-4"
            >
              <motion.button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-primary/50 transition-all duration-300 text-left group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                    {faq.question}
                  </h3>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      openIndex === index ? 'transform rotate-180 text-primary' : ''
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-gray-300 font-light">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 text-center"
        >
          <motion.div
            variants={itemVariants}
            className="inline-block p-1 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent"
          >
            <div className="px-8 py-4 rounded-xl bg-dark text-white">
              <motion.h3
                variants={slideInLeft}
                className="text-2xl font-bold mb-2"
              >
                Still Have Questions?
              </motion.h3>
              <motion.p
                variants={slideInRight}
                className="text-gray-300 mb-4 font-light"
              >
                Join our community to get answers.
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent text-white font-medium transition-all duration-300"
              >
                Join Discord
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ; 