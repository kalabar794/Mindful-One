import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FaHeart, FaRegHeart, FaSearch } from 'react-icons/fa';

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

// Sample meditation data
const meditationData = [
  {
    id: 'quick-calm',
    title: 'Quick Calm',
    duration: 5,
    category: 'Stress Relief',
    image: '🧘‍♀️',
    color: 'from-lavender to-babyblue',
    description: 'A quick meditation to center yourself and find calm in a busy day.'
  },
  {
    id: 'morning-gratitude',
    title: 'Morning Gratitude',
    duration: 10,
    category: 'Gratitude',
    image: '🌅',
    color: 'from-palepink to-lavender',
    description: 'Start your day with gratitude and positive intentions.'
  },
  {
    id: 'focus',
    title: 'Deep Focus',
    duration: 15,
    category: 'Focus',
    image: '🎯',
    color: 'from-mint to-babyblue',
    description: 'Enhance your concentration and focus for productive work sessions.'
  },
  {
    id: 'self-compassion',
    title: 'Self-Compassion',
    duration: 15,
    category: 'Self-Love',
    image: '💗',
    color: 'from-palepink to-lavender',
    description: 'Cultivate kindness and compassion toward yourself.'
  },
  {
    id: 'evening-release',
    title: 'Evening Release',
    duration: 10,
    category: 'Evening Wind-down',
    image: '🌙',
    color: 'from-darklavender to-darkpink',
    description: 'Release the tensions of the day and prepare for restful sleep.'
  },
  {
    id: 'anxiety-relief',
    title: 'Anxiety Relief',
    duration: 20,
    category: 'Stress Relief',
    image: '🌊',
    color: 'from-babyblue to-mint',
    description: 'Calm anxious thoughts and find your center with this guided practice.'
  },
  {
    id: 'body-scan',
    title: 'Body Scan Relaxation',
    duration: 30,
    category: 'Stress Relief',
    image: '✨',
    color: 'from-mint to-babyblue',
    description: 'A progressive relaxation through each part of your body.'
  },
  {
    id: 'loving-kindness',
    title: 'Loving Kindness',
    duration: 15,
    category: 'Self-Love',
    image: '❤️',
    color: 'from-palepink to-lavender',
    description: 'Cultivate feelings of love and kindness toward yourself and others.'
  }
];

// Category filter buttons
const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
  const categories = ['All', 'Stress Relief', 'Focus', 'Gratitude', 'Self-Love', 'Evening Wind-down'];
  
  return (
    <motion.div 
      className="flex overflow-x-auto pb-2 mb-4 hide-scrollbar"
      variants={itemVariants}
    >
      {categories.map(category => (
        <motion.button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap ${
            activeCategory === category 
              ? 'bg-white/40 text-purple-700' 
              : 'bg-white/20 text-gray-600 hover:bg-white/30'
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

// Meditation card with beautiful animations
const MeditationCard = ({ meditation }) => {
  const { isFavorite, toggleFavorite } = useAppContext();
  const isFav = isFavorite(meditation.id, 'meditation');
  
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="relative"
    >
      <Link 
        to={`/meditations/${meditation.id}`}
        className={`block rounded-xl overflow-hidden bg-gradient-to-br ${meditation.color} h-full`}
      >
        <div className="glass h-full p-5 flex flex-col">
          <div className="text-4xl mb-3">{meditation.image}</div>
          <h3 className="font-medium text-lg mb-1">{meditation.title}</h3>
          <p className="text-sm opacity-80 mb-2">{meditation.duration} min • {meditation.category}</p>
          <p className="text-sm opacity-80 flex-grow">{meditation.description}</p>
          
          {/* Animated play button */}
          <div className="mt-3 flex justify-end">
            <motion.div
              className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">▶️</span>
            </motion.div>
          </div>
        </div>
      </Link>
      
      {/* Favorite button */}
      <motion.button
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/30"
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(meditation.id, 'meditation');
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isFav ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart className="text-gray-600" />
        )}
      </motion.button>
    </motion.div>
  );
};

// Animated duration filter
const DurationFilter = ({ activeDuration, setActiveDuration }) => {
  const durations = [
    { label: 'All', value: 'all' },
    { label: '5 min', value: 5 },
    { label: '10 min', value: 10 },
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 }
  ];
  
  return (
    <motion.div 
      className="flex overflow-x-auto pb-2 mb-6 hide-scrollbar"
      variants={itemVariants}
    >
      {durations.map(duration => (
        <motion.button
          key={duration.value}
          onClick={() => setActiveDuration(duration.value)}
          className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap ${
            activeDuration === duration.value 
              ? 'bg-white/40 text-purple-700' 
              : 'bg-white/20 text-gray-600 hover:bg-white/30'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {duration.label}
        </motion.button>
      ))}
    </motion.div>
  );
};

const Meditations = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDuration, setActiveDuration] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMeditations, setFilteredMeditations] = useState(meditationData);
  
  // Filter meditations based on category, duration and search query
  useEffect(() => {
    let filtered = meditationData;
    
    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(med => med.category === activeCategory);
    }
    
    // Filter by duration
    if (activeDuration !== 'all') {
      filtered = filtered.filter(med => med.duration === activeDuration);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        med => med.title.toLowerCase().includes(query) || 
               med.description.toLowerCase().includes(query) ||
               med.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredMeditations(filtered);
  }, [activeCategory, activeDuration, searchQuery]);
  
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
        <h1 className="text-2xl font-medium mb-2">Guided Meditations</h1>
        <p className="text-gray-600 dark:text-gray-300">Find peace with our guided practices</p>
      </motion.div>
      
      {/* Search bar with animation */}
      <motion.div 
        variants={itemVariants}
        className="mb-6"
      >
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search meditations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </motion.div>
      
      {/* Category filter */}
      <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      
      {/* Duration filter */}
      <DurationFilter activeDuration={activeDuration} setActiveDuration={setActiveDuration} />
      
      {/* Meditation grid with staggered animation */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20"
        variants={containerVariants}
      >
        {filteredMeditations.length > 0 ? (
          filteredMeditations.map(meditation => (
            <MeditationCard key={meditation.id} meditation={meditation} />
          ))
        ) : (
          <motion.div 
            variants={itemVariants}
            className="col-span-2 text-center py-10"
          >
            <p className="text-lg">No meditations found. Try adjusting your filters.</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Meditations;
