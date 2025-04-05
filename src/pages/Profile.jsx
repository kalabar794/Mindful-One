import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCog, FaHeart, FaMedal, FaCalendar, FaChartLine, FaMoon, FaBell, FaVolumeUp } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
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

// Setting toggle component
const SettingToggle = ({ icon, title, description, isActive, onToggle }) => (
  <motion.div 
    variants={itemVariants}
    className="glass rounded-xl p-4 mb-4"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-xl mr-3">{icon}</span>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm opacity-70">{description}</p>
        </div>
      </div>
      <button 
        className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
          isActive ? 'bg-purple-500 justify-end' : 'bg-gray-400 justify-start'
        }`}
        onClick={onToggle}
      >
        <motion.div 
          layout
          className="w-4 h-4 bg-white rounded-full"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  </motion.div>
);

// Statistics item component
const StatItem = ({ icon, label, value, color }) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ y: -5 }}
    className={`glass rounded-xl p-4 flex flex-col items-center justify-center ${color}`}
  >
    <div className="text-2xl mb-2">{icon}</div>
    <p className="font-medium text-lg">{value}</p>
    <p className="text-sm opacity-70">{label}</p>
  </motion.div>
);

const Profile = () => {
  const { userPreferences, updatePreferences, theme, toggleTheme } = useAppContext();
  
  // Sample statistics data
  const statistics = {
    totalMinutes: 243,
    streak: 7,
    sessionsCompleted: 24,
    longestSession: 30
  };
  
  // Sample favorites (in a real app, would come from the app context)
  const [favorites, setFavorites] = useState([
    { id: 'quick-calm', title: 'Quick Calm', type: 'meditation', image: '🧘‍♀️' },
    { id: 'ocean-journey', title: 'Ocean Journey', type: 'story', image: '🌊' },
    { id: 'morning-gratitude', title: 'Morning Gratitude', type: 'meditation', image: '🌅' }
  ]);
  
  // Handle toggle changes
  const handleToggle = (setting) => {
    updatePreferences({
      [setting]: !userPreferences[setting]
    });
  };
  
  return (
    <motion.div
      className="min-h-screen pt-10 pb-24 px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl font-medium mb-2">Your Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">Track your progress and customize settings</p>
      </motion.div>
      
      {/* User info */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="glass rounded-xl p-6 flex items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl mr-4">
            M
          </div>
          <div>
            <h2 className="text-xl font-medium">Mindful User</h2>
            <p className="text-sm opacity-70">Meditation Enthusiast</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="ml-auto w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <FaCog />
          </motion.button>
        </div>
      </motion.div>
      
      {/* Statistics */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-xl font-medium mb-4">Your Progress</h2>
        <div className="grid grid-cols-2 gap-4">
          <StatItem 
            icon="⏱️" 
            label="Total Minutes" 
            value={statistics.totalMinutes} 
            color="bg-gradient-to-br from-lavender/40 to-babyblue/40" 
          />
          <StatItem 
            icon="🔥" 
            label="Day Streak" 
            value={statistics.streak} 
            color="bg-gradient-to-br from-palepink/40 to-lavender/40" 
          />
          <StatItem 
            icon="🏆" 
            label="Sessions" 
            value={statistics.sessionsCompleted} 
            color="bg-gradient-to-br from-mint/40 to-babyblue/40" 
          />
          <StatItem 
            icon="🌟" 
            label="Longest Session" 
            value={`${statistics.longestSession} min`} 
            color="bg-gradient-to-br from-babyblue/40 to-mint/40" 
          />
        </div>
      </motion.div>
      
      {/* Favorites */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-xl font-medium mb-4">Your Favorites</h2>
        {favorites.length > 0 ? (
          <div className="space-y-3">
            {favorites.map(item => (
              <div key={`${item.type}-${item.id}`} className="glass rounded-xl p-4 flex items-center">
                <div className="text-2xl mr-3">{item.image}</div>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm opacity-70 capitalize">{item.type}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-auto text-red-400"
                >
                  <FaHeart />
                </motion.button>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-6 text-center">
            <p>No favorites yet. Heart your favorite sessions!</p>
          </div>
        )}
      </motion.div>
      
      {/* Settings */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-medium mb-4">Settings</h2>
        
        <SettingToggle
          icon={<FaMoon />}
          title="Auto Night Mode"
          description="Automatically switch to dark theme at night"
          isActive={userPreferences.autoNightMode}
          onToggle={() => handleToggle('autoNightMode')}
        />
        
        <SettingToggle
          icon={<FaBell />}
          title="Reminders"
          description="Daily notifications for your practice"
          isActive={!!userPreferences.reminderTime}
          onToggle={() => handleToggle('reminderTime')}
        />
        
        <SettingToggle
          icon={<FaVolumeUp />}
          title="Haptic Feedback"
          description="Vibrations during breathing exercises"
          isActive={userPreferences.hapticFeedback}
          onToggle={() => handleToggle('hapticFeedback')}
        />
        
        {/* Daily Goal selector */}
        <motion.div variants={itemVariants} className="glass rounded-xl p-4 mb-4">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-3">🎯</span>
            <h3 className="font-medium">Daily Goal</h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={userPreferences.dailyGoal}
                onChange={(e) => updatePreferences({ dailyGoal: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                style={{
                  backgroundImage: `linear-gradient(to right, #a78bfa ${(userPreferences.dailyGoal / 60) * 100}%, rgba(255,255,255,0.2) ${(userPreferences.dailyGoal / 60) * 100}%)`
                }}
              />
            </div>
            <span className="ml-4 font-medium">{userPreferences.dailyGoal} min</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
