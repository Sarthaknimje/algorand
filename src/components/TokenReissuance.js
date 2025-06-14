import React from 'react';
import { motion } from 'framer-motion';
import {
  IdentityBindingSVG,
  VerificationSVG,
  WalletLinkSVG,
  SecureBindingSVG,
  TokenRecoverySVG,
  OnDemandSVG,
  BackgroundPatternSVG
} from './svg/TokenReissuanceSVGs';

const TokenReissuance = () => {
  const securityFeatures = [
    {
      icon: IdentityBindingSVG,
      title: "YouTube/Google Account Binding",
      description: "Connect your YouTube/Google account to securely link your identity with your wallet",
      color: "from-primary to-secondary"
    },
    {
      icon: VerificationSVG,
      title: "Email/Phone Verification",
      description: "Optional additional verification through email or phone number for enhanced security",
      color: "from-secondary to-accent"
    },
    {
      icon: WalletLinkSVG,
      title: "Wallet Signature Verification",
      description: "Sign a message with your wallet to create a secure link between your identity and wallet address",
      color: "from-accent to-primary"
    },
    {
      icon: SecureBindingSVG,
      title: "Secure Identity Binding",
      description: "Your identity (user@gmail.com) is securely bound to your wallet address in our system",
      color: "from-primary to-secondary"
    },
    {
      icon: TokenRecoverySVG,
      title: "Token Recovery System",
      description: "If you lose your wallet keys, your tokens can be recovered through the verified identity binding",
      color: "from-secondary to-accent"
    },
    {
      icon: OnDemandSVG,
      title: "On-Demand Tokenization",
      description: "Tokens can be reissued to a new wallet after identity verification and security checks",
      color: "from-accent to-primary"
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
      <div className="absolute inset-0">
        <BackgroundPatternSVG />
      </div>
      
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
              Secure Recovery
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
              Token
            </motion.span>
            <motion.span
              variants={slideInRight}
              className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient font-black"
            >
              Reissuance
            </motion.span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto font-light"
          >
            Secure identity binding and token recovery system to protect your investments
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

          <div className="space-y-12">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Connection dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary" />

                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
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
                </div>
              </motion.div>
            ))}
          </div>
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
                Ready to Secure Your Tokens?
              </motion.h3>
              <motion.p
                variants={slideInRight}
                className="text-gray-300 mb-4 font-light"
              >
                Connect your wallet and bind your identity for secure token recovery.
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

export default TokenReissuance; 