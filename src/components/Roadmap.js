import React from 'react';
import { motion } from 'framer-motion';
import { 
  RocketLaunchIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Roadmap = () => {
  const phases = [
    {
      title: "Phase 1: Launch",
      icon: RocketLaunchIcon,
      items: [
        "Token launch on Algorand",
        "Website and whitepaper release",
        "Community building",
        "Initial marketing campaign"
      ],
      status: "completed"
    },
    {
      title: "Phase 2: Growth",
      icon: ChartBarIcon,
      items: [
        "Exchange listings",
        "Partnership announcements",
        "Enhanced token utility",
        "Community rewards program"
      ],
      status: "current"
    },
    {
      title: "Phase 3: Expansion",
      icon: GlobeAltIcon,
      items: [
        "Global marketing campaign",
        "Mobile app development",
        "Cross-chain integration",
        "Governance implementation"
      ],
      status: "upcoming"
    },
    {
      title: "Phase 4: Ecosystem",
      icon: UserGroupIcon,
      items: [
        "DAO governance",
        "Staking platform",
        "NFT marketplace",
        "DeFi integrations"
      ],
      status: "upcoming"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-dark via-dark-lighter to-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Roadmap</h2>
          <p className="text-xl text-gray-300">
            Our journey to revolutionize creator economy
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-secondary to-accent" />

          <div className="space-y-12">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                  <div className={`bg-white/5 backdrop-blur-lg rounded-2xl p-6 border ${
                    phase.status === 'completed' 
                      ? 'border-primary/50' 
                      : phase.status === 'current'
                      ? 'border-secondary/50'
                      : 'border-white/10'
                  }`}>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        phase.status === 'completed'
                          ? 'bg-primary/20'
                          : phase.status === 'current'
                          ? 'bg-secondary/20'
                          : 'bg-white/10'
                      }`}>
                        <phase.icon className={`w-6 h-6 ${
                          phase.status === 'completed'
                            ? 'text-primary'
                            : phase.status === 'current'
                            ? 'text-secondary'
                            : 'text-white'
                        }`} />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{phase.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center space-x-2 text-gray-300">
                          <span className={`w-2 h-2 rounded-full ${
                            phase.status === 'completed'
                              ? 'bg-primary'
                              : phase.status === 'current'
                              ? 'bg-secondary'
                              : 'bg-white/30'
                          }`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-dark">
                  <div className={`w-4 h-4 rounded-full ${
                    phase.status === 'completed'
                      ? 'bg-primary'
                      : phase.status === 'current'
                      ? 'bg-secondary'
                      : 'bg-white/30'
                  }`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap; 