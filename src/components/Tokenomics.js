import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Tokenomics = () => {
  const tokenomicsData = [
    {
      title: "Total Supply",
      value: "1,000,000,000",
      description: "Fixed supply with controlled distribution",
      icon: ChartBarIcon
    },
    {
      title: "Initial Price",
      value: "0.1 ALGO",
      description: "Fair launch price for early adopters",
      icon: CurrencyDollarIcon
    },
    {
      title: "Holders",
      value: "10,000+",
      description: "Growing community of token holders",
      icon: UserGroupIcon
    },
    {
      title: "Lock Period",
      value: "12 Months",
      description: "Team tokens locked for stability",
      icon: ClockIcon
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-dark via-dark-lighter to-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Tokenomics</h2>
          <p className="text-xl text-gray-300">
            Understanding the economic model behind EngageCoin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tokenomicsData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              </div>
              <p className="text-3xl font-bold text-white mb-2">{item.value}</p>
              <p className="text-gray-300">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Community & Ecosystem</span>
                  <span className="text-white font-semibold">40%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[40%] bg-gradient-to-r from-primary via-secondary to-accent" />
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Team & Development</span>
                  <span className="text-white font-semibold">20%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[20%] bg-gradient-to-r from-primary via-secondary to-accent" />
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Marketing & Partnerships</span>
                  <span className="text-white font-semibold">15%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[15%] bg-gradient-to-r from-primary via-secondary to-accent" />
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Liquidity Pool</span>
                  <span className="text-white font-semibold">15%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[15%] bg-gradient-to-r from-primary via-secondary to-accent" />
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Advisors & Partners</span>
                  <span className="text-white font-semibold">10%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[10%] bg-gradient-to-r from-primary via-secondary to-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics; 