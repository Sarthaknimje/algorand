import React from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  ShieldCheckIcon, 
  UserGroupIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  CurrencyYenIcon
} from '@heroicons/react/24/outline';

const KeyFeatures = () => {
  const features = [
    {
      icon: CurrencyDollarIcon,
      title: "Token Monetization",
      description: "Creators can monetize their content through token sales and value appreciation.",
      color: "from-primary to-secondary"
    },
    {
      icon: ChartBarIcon,
      title: "Value Growth",
      description: "Tokens increase in value as channels grow, creating potential for significant returns.",
      color: "from-secondary to-accent"
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure Platform",
      description: "Built on Algorand blockchain with advanced security features and smart contracts.",
      color: "from-accent to-primary"
    },
    {
      icon: UserGroupIcon,
      title: "Community Engagement",
      description: "Fans can support creators and participate in channel growth through token ownership.",
      color: "from-primary to-secondary"
    },
    {
      icon: RocketLaunchIcon,
      title: "Easy Integration",
      description: "Simple integration with YouTube channels and creator accounts.",
      color: "from-secondary to-accent"
    },
    {
      icon: GlobeAltIcon,
      title: "Global Reach",
      description: "Access to a global audience of creators and investors.",
      color: "from-accent to-primary"
    },
    {
      icon: CurrencyYenIcon,
      title: "Flexible Pricing",
      description: "Creators can set their own token prices and distribution strategies.",
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
              Why Choose EngageCoin
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
              Key
            </motion.span>
            <motion.span
              variants={slideInRight}
              className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient font-black"
            >
              Features
            </motion.span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto font-light"
          >
            Discover the powerful features that make EngageCoin the future of creator monetization.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
              <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-primary/50 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} p-2 group-hover:shadow-glow transition-all duration-300`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
                Ready to Get Started?
              </motion.h3>
              <motion.p
                variants={slideInRight}
                className="text-gray-300 mb-4 font-light"
              >
                Join the future of creator monetization today.
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent text-white font-medium transition-all duration-300"
              >
                Connect Wallet
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default KeyFeatures; 