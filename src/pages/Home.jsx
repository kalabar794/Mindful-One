import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: { ease: "easeInOut" }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

// Floating elements animation
const FloatingElement = ({ delay, children, className }) => (
  <motion.div
    className={className}
    initial={{ y: 0 }}
    animate={{ 
      y: [0, -10, 0],
      rotate: [0, 2, 0, -2, 0]
    }}
    transition={{ 
      duration: 6, 
      repeat: Infinity, 
      repeatType: "loop",
      delay: delay
    }}
  >
    {children}
  </motion.div>
);

// Mandala animation
const MandalaAnimation = () => {
  const { theme } = useAppContext();
  
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-20">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute top-0 left-0 w-full h-full border-2 rounded-full ${
            theme === 'dark' ? 'border-white/30' : 'border-purple-500/30'
          }`}
          style={{
            width: `${(i + 1) * 50}px`,
            height: `${(i + 1) * 50}px`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: {
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
        />
      ))}
      
      {/* Inner circles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`inner-${i}`}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
            theme === 'dark' ? 'bg-white/10' : 'bg-purple-500/10'
          }`}
          style={{
            width: `${20 - i * 5}px`,
            height: `${20 - i * 5}px`,
          }}
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.5
          }}
        />
      ))}
    </div>
  );
};

// Quick access card component
const QuickAccessCard = ({ title, description, icon, to, color }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.98 }}
  >
    <Link to={to} className={`block glass rounded-xl p-4 ${color}`}>
      <div className="flex items-center mb-2">
        <div className="mr-3 text-2xl">{icon}</div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <p className="text-sm opacity-80">{description}</p>
    </Link>
  </motion.div>
);

const Home = () => {
  const { theme } = useAppContext();
  
  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div
      className="min-h-screen pt-10 pb-24 px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Mandala background animation */}
      <MandalaAnimation />
      
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8 relative z-10">
        <h1 className="text-3xl font-light mb-2">
          {getGreeting()}, <span className="gradient-text font-medium">Mindful One</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300">How are you feeling today?</p>
      </motion.div>
      
      {/* Daily quote */}
      <motion.div 
        variants={itemVariants}
        className="glass rounded-xl p-6 mb-8 relative overflow-hidden"
      >
        <FloatingElement delay={0} className="absolute -right-4 -top-4 text-4xl opacity-20">
          ✨
        </FloatingElement>
        <FloatingElement delay={2} className="absolute -left-2 -bottom-2 text-4xl opacity-20">
          🌿
        </FloatingElement>
        
        <h2 className="text-lg font-medium mb-2">Today's Mindful Thought</h2>
        <p className="italic text-gray-700 dark:text-gray-200">
          "Breathing in, I calm my body. Breathing out, I smile. Dwelling in the present moment, I know this is a wonderful moment."
        </p>
        <p className="text-right text-sm mt-2 text-gray-600 dark:text-gray-300">— Thich Nhat Hanh</p>
      </motion.div>
      
      {/* Quick access cards */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-medium mb-4">Quick Start</h2>
        <div className="grid grid-cols-2 gap-4">
          <QuickAccessCard
            title="5-Min Calm"
            description="A quick meditation to center yourself"
            icon="🧘‍♀️"
            to="/meditations/quick-calm"
            color="bg-gradient-to-br from-lavender/40 to-babyblue/40"
          />
          <QuickAccessCard
            title="Breathe"
            description="Guided breathing exercise"
            icon="🌬️"
            to="/breathing"
            color="bg-gradient-to-br from-mint/40 to-babyblue/40"
          />
          <QuickAccessCard
            title="Sleep Well"
            description="Prepare for restful sleep"
            icon="🌙"
            to="/sleep-stories"
            color="bg-gradient-to-br from-palepink/40 to-lavender/40"
          />
          <QuickAccessCard
            title="Daily Focus"
            description="Enhance concentration"
            icon="🎯"
            to="/meditations/focus"
            color="bg-gradient-to-br from-babyblue/40 to-mint/40"
          />
        </div>
      </motion.div>
      
      {/* Daily progress */}
      <motion.div variants={itemVariants} className="mt-8">
        <h2 className="text-xl font-medium mb-4">Your Progress</h2>
        <div className="glass rounded-xl p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Daily Goal</span>
            <span className="text-sm font-medium">10 min / 10 min</span>
          </div>
          
          {/* Progress bar */}
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          
          {/* Streak */}
          <div className="mt-4 flex items-center">
            <span className="text-sm mr-2">Current streak:</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-6 h-6 flex items-center justify-center text-xs"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  🔥
                </motion.div>
              ))}
            </div>
            <span className="text-sm font-medium ml-1">5 days</span>
          </div>
        </div>
      </motion.div>
      
      {/* Recommended for you */}
      <motion.div variants={itemVariants} className="mt-8 mb-20">
        <h2 className="text-xl font-medium mb-4">Recommended for You</h2>
        <div className="glass rounded-xl p-4 flex items-center">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl mr-4">
            🌊
          </div>
          <div>
            <h3 className="font-medium">Ocean Waves Meditation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">15 minutes • Stress Relief</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="ml-auto w-10 h-10 rounded-full bg-white/30 flex items-center justify-center"
          >
            ▶️
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
