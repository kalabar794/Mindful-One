import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaMoon, FaVolumeUp, FaClock } from 'react-icons/fa';
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

// Sample sleep stories data
const sleepStoriesData = [
  {
    id: 'ocean-journey',
    title: 'Ocean Journey',
    duration: 25,
    category: 'Nature',
    image: '🌊',
    color: 'from-darkblue to-babyblue',
    description: 'Drift off to sleep as you journey across calm ocean waters under a starry night sky.',
    progress: 0
  },
  {
    id: 'enchanted-forest',
    title: 'The Enchanted Forest',
    duration: 30,
    category: 'Fantasy',
    image: '🌳',
    color: 'from-darkmint to-mint',
    description: 'Explore a magical forest filled with gentle creatures and soothing sounds of nature.',
    progress: 65
  },
  {
    id: 'night-train',
    title: 'Night Train to the Stars',
    duration: 20,
    category: 'Travel',
    image: '🚂',
    color: 'from-darklavender to-lavender',
    description: 'Board a peaceful night train that travels through beautiful landscapes and eventually to the stars.',
    progress: 0
  },
  {
    id: 'desert-oasis',
    title: 'Desert Oasis',
    duration: 22,
    category: 'Nature',
    image: '🏜️',
    color: 'from-darkpink to-palepink',
    description: 'Find peace at a tranquil desert oasis under the moonlight with gentle winds and distant dunes.',
    progress: 0
  },
  {
    id: 'ancient-library',
    title: 'The Ancient Library',
    duration: 28,
    category: 'Fantasy',
    image: '📚',
    color: 'from-darklavender to-palepink',
    description: 'Wander through a mysterious ancient library filled with magical books and whispered stories.',
    progress: 15
  },
  {
    id: 'rainy-cabin',
    title: 'Rainy Night Cabin',
    duration: 35,
    category: 'Nature',
    image: '🌧️',
    color: 'from-darkblue to-babyblue',
    description: 'Relax in a cozy cabin as rain gently falls on the roof and a fire crackles in the hearth.',
    progress: 0
  },
  {
    id: 'space-journey',
    title: 'Journey Through the Cosmos',
    duration: 32,
    category: 'Fantasy',
    image: '🌌',
    color: 'from-darklavender to-darkblue',
    description: 'Float peacefully through the stars and nebulae on a gentle cosmic journey.',
    progress: 0
  },
  {
    id: 'mountain-retreat',
    title: 'Mountain Retreat',
    duration: 26,
    category: 'Nature',
    image: '⛰️',
    color: 'from-darkmint to-darkblue',
    description: 'Escape to a peaceful mountain retreat with panoramic views and the gentle sounds of nature.',
    progress: 0
  }
];

// Category filter buttons with night mode styling
const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
  const categories = ['All', 'Nature', 'Fantasy', 'Travel'];
  
  return (
    <motion.div 
      className="flex overflow-x-auto pb-2 mb-6 hide-scrollbar"
      variants={itemVariants}
    >
      {categories.map(category => (
        <motion.button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap ${
            activeCategory === category 
              ? 'bg-white/30 text-purple-300' 
              : 'bg-white/10 text-gray-400 hover:bg-white/20'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category}
        </motion.button>
      ))}
    </motion.div>
  );
};

// Sleep timer selector
const SleepTimerSelector = () => {
  const [activeTimer, setActiveTimer] = useState(null);
  const timers = [15, 30, 45, 60, 'Off'];
  
  return (
    <motion.div 
      variants={itemVariants}
      className="glass rounded-xl p-4 mb-6 bg-darkblue/30"
    >
      <div className="flex items-center mb-3">
        <FaClock className="mr-2 text-purple-300" />
        <h3 className="text-lg font-medium text-white">Sleep Timer</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {timers.map(timer => (
          <motion.button
            key={timer}
            onClick={() => setActiveTimer(timer)}
            className={`px-4 py-2 rounded-full ${
              activeTimer === timer 
                ? 'bg-purple-500/50 text-white' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {timer === 'Off' ? timer : `${timer} min`}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Story card with beautiful animations and night theme
const StoryCard = ({ story }) => {
  const { isFavorite, toggleFavorite } = useAppContext();
  const isFav = isFavorite(story.id, 'story');
  
  // Star animation for the background
  const StarField = () => (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            width: Math.random() * 2 + 1 + 'px',
            height: Math.random() * 2 + 1 + 'px',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
  
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="relative"
    >
      <Link 
        to={`/sleep-stories/${story.id}`}
        className={`block rounded-xl overflow-hidden bg-gradient-to-br ${story.color} h-full`}
      >
        <div className="glass h-full p-5 flex flex-col bg-black/40">
          {/* Star field background */}
          <StarField />
          
          {/* Content */}
          <div className="relative z-10">
            <div className="text-4xl mb-3">{story.image}</div>
            <h3 className="font-medium text-lg mb-1 text-white">{story.title}</h3>
            <p className="text-sm opacity-80 mb-2 text-gray-300">{story.duration} min • {story.category}</p>
            <p className="text-sm opacity-80 text-gray-300 flex-grow">{story.description}</p>
            
            {/* Progress bar (if story has been started) */}
            {story.progress > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Continue</span>
                  <span>{Math.round(story.progress)}%</span>
                </div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-400"
                    style={{ width: `${story.progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Play button */}
            <div className="mt-3 flex justify-end">
              <motion.div
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">▶️</span>
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Favorite button */}
      <motion.button
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/20"
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(story.id, 'story');
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isFav ? (
          <FaHeart className="text-red-400" />
        ) : (
          <FaRegHeart className="text-gray-300" />
        )}
      </motion.button>
    </motion.div>
  );
};

// White noise options
const WhiteNoiseOptions = () => {
  const [activeNoise, setActiveNoise] = useState(null);
  const [volume, setVolume] = useState(50);
  
  const noiseOptions = [
    { id: 'rain', name: 'Rain', icon: '🌧️' },
    { id: 'waves', name: 'Ocean Waves', icon: '🌊' },
    { id: 'fire', name: 'Crackling Fire', icon: '🔥' },
    { id: 'fan', name: 'Fan', icon: '💨' },
    { id: 'forest', name: 'Forest Night', icon: '🌲' }
  ];
  
  return (
    <motion.div 
      variants={itemVariants}
      className="glass rounded-xl p-4 mb-6 bg-darkblue/30"
    >
      <div className="flex items-center mb-3">
        <FaVolumeUp className="mr-2 text-purple-300" />
        <h3 className="text-lg font-medium text-white">White Noise</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {noiseOptions.map(noise => (
          <motion.button
            key={noise.id}
            onClick={() => setActiveNoise(activeNoise === noise.id ? null : noise.id)}
            className={`px-3 py-2 rounded-lg flex flex-col items-center ${
              activeNoise === noise.id 
                ? 'bg-purple-500/50 text-white' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl mb-1">{noise.icon}</span>
            <span className="text-xs">{noise.name}</span>
          </motion.button>
        ))}
      </div>
      
      {activeNoise && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Volume</span>
            <span>{volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
            style={{
              backgroundImage: `linear-gradient(to right, #a78bfa ${volume}%, rgba(255,255,255,0.2) ${volume}%)`
            }}
          />
        </div>
      )}
    </motion.div>
  );
};

const SleepStories = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredStories, setFilteredStories] = useState(sleepStoriesData);
  
  // Filter stories based on category
  React.useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredStories(sleepStoriesData);
    } else {
      setFilteredStories(sleepStoriesData.filter(story => story.category === activeCategory));
    }
  }, [activeCategory]);
  
  return (
    <motion.div
      className="min-h-screen pt-10 pb-24 px-6 bg-gradient-to-br from-darklavender via-darkblue to-darkpink"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Night sky effect */}
      <div className="fixed inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6 flex items-center">
          <FaMoon className="text-yellow-200 mr-3 text-xl" />
          <div>
            <h1 className="text-2xl font-medium mb-1 text-white">Sleep Stories</h1>
            <p className="text-gray-300">Drift into peaceful sleep with calming stories</p>
          </div>
        </motion.div>
        
        {/* Continue listening */}
        {sleepStoriesData.some(story => story.progress > 0) && (
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-xl font-medium mb-3 text-white">Continue Listening</h2>
            <div className="grid grid-cols-1 gap-4">
              {sleepStoriesData
                .filter(story => story.progress > 0)
                .map(story => (
                  <StoryCard key={story.id} story={story} />
                ))}
            </div>
          </motion.div>
        )}
        
        {/* Sleep timer */}
        <SleepTimerSelector />
        
        {/* White noise options */}
        <WhiteNoiseOptions />
        
        {/* Category filter */}
        <motion.div variants={itemVariants} className="mb-3">
          <h2 className="text-xl font-medium text-white">Sleep Stories</h2>
        </motion.div>
        <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        
        {/* Stories grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20"
          variants={containerVariants}
        >
          {filteredStories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SleepStories;
