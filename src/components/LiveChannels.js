import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const LiveChannels = () => {
  const channels = [
    {
      name: "Tech Reviews",
      category: "Technology",
      followers: "235k",
      tokenPrice: "0.92 ALGO",
      growth: "+12.3%",
      color: "from-primary to-secondary"
    },
    {
      name: "Gaming Master",
      category: "Gaming",
      followers: "1.2M",
      tokenPrice: "2.45 ALGO",
      growth: "+8.7%",
      color: "from-secondary to-accent"
    },
    {
      name: "Crypto News",
      category: "Finance",
      followers: "450k",
      tokenPrice: "1.75 ALGO",
      growth: "+15.2%",
      color: "from-accent to-primary"
    },
    {
      name: "Cooking Pro",
      category: "Food",
      followers: "890k",
      tokenPrice: "1.25 ALGO",
      growth: "+5.8%",
      color: "from-primary to-secondary"
    }
  ];

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
              Trending Channels
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
              Live
            </motion.span>
            <motion.span
              variants={slideInRight}
              className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient font-black"
            >
              Channels
            </motion.span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto font-light"
          >
            Discover and invest in trending creator tokens
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {channels.map((channel, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${channel.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
              <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-primary/50 transition-all duration-300">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">
                      {channel.name}
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                      {channel.category}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <UserGroupIcon className="w-5 h-5" />
                      <span className="font-light">{channel.followers} Followers</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <CurrencyDollarIcon className="w-5 h-5" />
                      <span className="font-light">{channel.tokenPrice}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <ArrowTrendingUpIcon className="w-5 h-5" />
                      <span className="font-light">{channel.growth}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent text-white text-sm font-medium transition-all duration-300"
                  >
                    Buy / Sell
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveChannels; 