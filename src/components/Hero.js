import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownIcon } from '@heroicons/react/24/outline';

const Hero = ({ scrollToSection }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
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

  const channels = [
    { name: "Tech Reviews", subscribers: "2.5M", image: "https://i.pravatar.cc/150?img=1" },
    { name: "Gaming", subscribers: "1.8M", image: "https://i.pravatar.cc/150?img=2" },
    { name: "Cooking", subscribers: "3.2M", image: "https://i.pravatar.cc/150?img=3" },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-dark via-dark-lighter to-dark">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-primary/20 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-radial from-secondary/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-1/2 w-full h-full bg-gradient-radial from-accent/20 via-transparent to-transparent" />
      </motion.div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Floating elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
          }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary via-secondary to-accent animate-gradient" />
        </motion.div>
      ))}

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={slideInLeft}
          className="inline-block p-1 rounded-full bg-gradient-to-r from-primary via-secondary to-accent mb-8"
        >
          <div className="px-4 py-1 rounded-full bg-dark text-white text-sm font-medium">
            🚀 The Future of Creator Tokens
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          <motion.span
            variants={slideInLeft}
            className="block text-white mb-2 font-light italic"
          >
            Welcome to the
          </motion.span>
          <motion.span
            variants={slideInRight}
            className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient font-black"
          >
            Future of Creator Tokens
          </motion.span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-light"
        >
          EngageCoin lets fans buy and sell tokens tied to YouTube channels.
          The more a channel grows, the more valuable your tokens become.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent hover:from-accent hover:to-primary text-white font-medium transition-all duration-300 shadow-glow"
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(236,72,153,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-lg bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white font-medium transition-all duration-300 border border-white/20"
            onClick={() => scrollToSection('how-it-works')}
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Featured Channels */}
        <motion.div
          variants={containerVariants}
          className="mt-20"
        >
          <motion.h3
            variants={slideInLeft}
            className="text-2xl font-bold mb-8 text-white"
          >
            Featured Channels
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {channels.map((channel, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-primary/50 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={channel.image}
                      alt={channel.name}
                      className="w-12 h-12 rounded-full border-2 border-primary"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-white">{channel.name}</h4>
                      <p className="text-sm text-gray-400">{channel.subscribers} subscribers</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                      <span className="text-sm text-gray-300">YouTube Channel</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium"
                    >
                      View Channel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { label: "Active Channels", value: "500+", icon: "📺" },
            { label: "Total Volume", value: "1.2M ALGO", icon: "💰" },
            { label: "Active Users", value: "10K+", icon: "👥" },
            { label: "Avg. ROI", value: "32%", icon: "📈" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.05 }}
              className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-primary/50 transition-all duration-300"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.button
          onClick={() => scrollToSection('what-is-engagecoin')}
          className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
          whileHover={{ y: 5 }}
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <ArrowDownIcon className="h-6 w-6 animate-bounce" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Hero; 