import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaArrowLeft, FaClock, FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import { storyAudioData } from '../data/audioData';
import useAudio from '../hooks/useAudio';
import AudioVisualizer from '../animations/AudioVisualizer';

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

// Sample sleep story data
const storiesData = [
  {
    id: 'ocean-journey',
    title: 'Ocean Journey',
    duration: 25,
    category: 'Nature',
    image: '🌊',
    color: 'from-darkblue to-babyblue',
    description: 'Drift off to sleep as you journey across calm ocean waters under a starry night sky.',
    longDescription: 'Let the gentle rhythm of ocean waves carry you to dreamland. This sleep story guides you on a peaceful journey across moonlit waters, as the stars twinkle above and the gentle rocking of your boat lulls you into deep, restorative sleep.',
    audioUrl: '/sleep-stories/ocean-journey.mp3',
  },
  {
    id: 'night-train',
    title: 'Night Train to the Stars',
    duration: 20,
    category: 'Travel',
    image: '🚂',
    color: 'from-darklavender to-lavender',
    description: 'Board a peaceful night train that travels through beautiful landscapes and eventually to the stars.',
    longDescription: 'Board a magical night train that whisks you away through misty mountains and peaceful countryside. As the rhythmic sounds of the train tracks lull you deeper into relaxation, your journey transitions from Earth to the cosmos, where you\'ll drift among the stars.',
    audioUrl: '/sleep-stories/night-train.mp3',
  }
];

// Night sky animation
const NightSkyAnimation = ({ playing }) => {
  return (
    <div className="fixed inset-0 z-0">
      {/* Stars */}
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
            opacity: playing ? [0.1, 0.8, 0.1] : 0.3,
            scale: playing ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: Math.random() * 3 + 3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      {/* Moon */}
      <motion.div
        className="absolute w-16 h-16 rounded-full bg-yellow-100 shadow-lg"
        style={{
          top: '10%',
          right: '10%',
          boxShadow: '0 0 20px 5px rgba(255, 255, 224, 0.4)'
        }}
        animate={{
          opacity: playing ? [0.7, 0.9, 0.7] : 0.7,
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {/* Clouds */}
      {playing && [...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/10 rounded-full blur-md"
          style={{
            width: `${Math.random() * 300 + 200}px`,
            height: `${Math.random() * 100 + 50}px`,
            top: `${Math.random() * 40 + 20}%`,
          }}
          initial={{ left: '-30%' }}
          animate={{ left: '130%' }}
          transition={{
            duration: Math.random() * 120 + 180,
            repeat: Infinity,
            delay: i * 40,
          }}
        />
      ))}
    </div>
  );
};

// Progress bar component
const ProgressBar = ({ progress, duration, seek }) => {
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-sm text-indigo-900 mb-1 font-medium">
        <span>{formatTime(progress * duration * 60)}</span>
        <span>{formatTime(duration * 60)}</span>
      </div>
      <div 
        className="h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const newProgress = (e.clientX - rect.left) / rect.width;
          seek(Math.max(0, Math.min(1, newProgress)));
        }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-purple-400 to-blue-400"
          style={{ width: `${progress * 100}%` }}
          transition={{ type: "tween" }}
        />
      </div>
    </div>
  );
};

// Volume controls component
const VolumeControls = ({ 
  volume, 
  onVolumeChange, 
  muted, 
  onMuteToggle 
}) => {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <span className="text-indigo-900 text-sm font-medium">Volume</span>
        <div className="flex items-center">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-24 sm:w-32 accent-purple-400"
          />
          <button 
            onClick={onMuteToggle}
            className="ml-2 text-indigo-900"
          >
            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>
      </div>
    </div>
  );
};

// Sleep timer selector
const SleepTimer = ({ onTimerChange }) => {
  const [activeTimer, setActiveTimer] = useState(null);
  const timers = [15, 30, 45, 60, 'Off'];
  
  const handleTimerChange = (timer) => {
    if (timer === 'Off' || timer === activeTimer) {
      setActiveTimer(null);
      onTimerChange(null);
    } else {
      setActiveTimer(timer);
      onTimerChange(timer);
    }
  };
  
  return (
    <div className="mb-6">
      <p className="text-indigo-900 text-sm font-medium mb-2 sm:mb-3">Sleep Timer</p>
      <div className="flex flex-wrap gap-2">
        {timers.map((timer) => (
          <button
            key={timer}
            onClick={() => handleTimerChange(timer)}
            className={`px-3 py-1 rounded-full text-sm ${
              activeTimer === timer
                ? 'bg-indigo-500 text-white'
                : 'bg-white/30 text-indigo-900 hover:bg-white/50'
            } transition-colors`}
          >
            {timer === 'Off' ? timer : `${timer} min`}
          </button>
        ))}
      </div>
    </div>
  );
};

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useAppContext();
  
  // Find story data by ID
  const story = storiesData.find(s => s.id === id) || storiesData[0];
  
  // Get audio data for this story
  const audioData = storyAudioData[story.id] || {};
  
  // State for sleep timer
  const [sleepTimer, setSleepTimer] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  
  // Use our custom audio hook
  const {
    loading,
    playing,
    muted,
    volume,
    progress,
    togglePlay,
    toggleMute,
    seek,
    setVolume,
  } = useAudio({
    mainAudioUrl: audioData.audioUrl,
    backgroundAudioUrl: audioData.backgroundAudioUrl,
    onEndCallback: () => {
      // Reset sleep timer when audio ends naturally
      setSleepTimer(null);
      setRemainingTime(null);
    }
  });
  
  // Handle sleep timer
  useEffect(() => {
    if (sleepTimer === null || sleepTimer === 'Off' || !playing) {
      setRemainingTime(null);
      return;
    }
    
    setRemainingTime(sleepTimer * 60);
    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          togglePlay(); // Stop playback when timer ends
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sleepTimer, playing]);
  
  // Format remaining time
  const formatRemainingTime = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-darklavender via-darkblue to-darkpink">
      {/* Night sky animation */}
      <NightSkyAnimation playing={playing} />
      
      {/* Content */}
      <motion.div
        className="relative z-10 pt-10 pb-24 px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Back button and favorite */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-between mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="text-white" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            onClick={() => toggleFavorite(story.id, 'story')}
          >
            {isFavorite(story.id, 'story') ? (
              <FaHeart className="text-red-400" />
            ) : (
              <FaRegHeart className="text-white" />
            )}
          </motion.button>
        </motion.div>
        
        {/* Story info */}
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <div className="text-5xl mb-4">{story.image}</div>
          <h1 className="text-2xl font-medium mb-2 text-indigo-900">{story.title}</h1>
          <p className="text-indigo-800 mb-2">{story.duration} min • {story.category}</p>
        </motion.div>
        
        {/* Story description */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="glass rounded-xl p-6 bg-white/10 shadow-lg">
            <p className="text-indigo-900 leading-relaxed font-semibold">{story.longDescription}</p>
          </div>
        </motion.div>
        
        {/* Sleep timer */}
        <motion.div variants={itemVariants}>
          <SleepTimer onTimerChange={setSleepTimer} />
        </motion.div>
        
        {/* Volume controls */}
        <motion.div variants={itemVariants}>
          <VolumeControls 
            volume={volume}
            onVolumeChange={setVolume}
            muted={muted}
            onMuteToggle={toggleMute}
          />
        </motion.div>
        
        {/* Player controls */}
        <motion.div 
          variants={itemVariants}
          className={`glass rounded-xl p-6 ${playing ? 'bg-black/30' : 'bg-black/20'} transition-colors duration-1000`}
        >
          {/* Sleep timer countdown */}
          {remainingTime && (
            <div className="text-center mb-4">
              <p className="text-sm text-white/70">
                Sleep timer: <span className="text-white">{formatRemainingTime(remainingTime)}</span>
              </p>
            </div>
          )}
          
          {/* Audio visualizer */}
          <div className="mb-6 h-40 rounded-xl overflow-hidden glass">
            <AudioVisualizer 
              isPlaying={playing}
              intensity={0.6}
              type={story.id === 'night-train' ? 'particles' : story.id === 'ocean-journey' ? 'circle' : 'wave'}
              color={`rgba(${story.id === 'night-train' ? '135, 206, 250' : story.id === 'ocean-journey' ? '64, 224, 208' : '186, 85, 211'}, 0.7)`}
            />
          </div>
          
          {/* Progress bar */}
          <ProgressBar progress={progress} duration={story.duration} seek={seek} />
          
          {/* Play/pause button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-16 h-16 rounded-full ${playing ? 'bg-white' : 'bg-gradient-to-r from-purple-400 to-blue-400'} flex items-center justify-center`}
              onClick={togglePlay}
            >
              {playing ? (
                <FaPause className={`text-2xl ${playing ? 'text-purple-500' : 'text-white'}`} />
              ) : (
                <FaPlay className="text-2xl text-white ml-1" />
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StoryDetail;
