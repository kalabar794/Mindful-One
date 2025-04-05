import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaArrowLeft, FaVolumeUp, FaVolumeMute, FaPause, FaPlay } from 'react-icons/fa';
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

// Sample meditation data - would come from API/database in a real app
const meditationData = [
  {
    id: 'quick-calm',
    title: 'Quick Calm',
    duration: 5,
    category: 'Stress Relief',
    image: '🧘‍♀️',
    color: 'from-lavender to-babyblue',
    description: 'A quick meditation to center yourself and find calm in a busy day.',
    longDescription: 'This short meditation is perfect for a quick reset during a busy day. Focusing on your breath and body, you\'ll gently release tension and return to your activities with renewed clarity and calm.',
    audioUrl: '/meditations/quick-calm.mp3',
    backgroundAnimation: 'gentle-waves',
  },
  {
    id: 'focus',
    title: 'Deep Focus',
    duration: 15,
    category: 'Focus',
    image: '🎯',
    color: 'from-mint to-babyblue',
    description: 'Enhance your concentration and focus for productive work sessions.',
    longDescription: 'Designed to increase concentration and mental clarity, this meditation uses visualization techniques to help you enter a state of deep focus. Perfect for before starting work or creative activities.',
    audioUrl: '/meditations/deep-focus.mp3',
    backgroundAnimation: 'geometric-patterns',
  }
  // Other meditations would be defined similarly
];

// Dynamic mandala animation component
const MandalaAnimation = ({ playing, animationStyle }) => {
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    let animationFrame;
    let lastTime = 0;
    
    const animate = (time) => {
      if (lastTime !== 0) {
        const delta = time - lastTime;
        if (playing) {
          setRotation(prev => (prev + delta * 0.01) % 360);
        }
      }
      lastTime = time;
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [playing]);
  
  // Different mandala styles based on the meditation type
  const getMandalaElements = () => {
    switch (animationStyle) {
      case 'geometric-patterns':
        return Array(8).fill().map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              transform: `rotate(${rotation + (i * 5)}deg) scale(${0.6 + i * 0.05})`,
            }}
          />
        ));
      case 'gentle-waves':
        return Array(6).fill().map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              transform: `rotate(${rotation * (i % 2 ? -1 : 1)}deg) scale(${0.7 + i * 0.05})`,
              opacity: 0.5 + (Math.sin(rotation / 30 + i) + 1) / 4,
            }}
          />
        ));
      default:
        return Array(5).fill().map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              transform: `rotate(${rotation + (i * 15)}deg) scale(${0.8 + i * 0.04})`,
            }}
          />
        ));
    }
  };
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-80 h-80">
        {getMandalaElements()}
      </div>
    </div>
  );
};

// Particle effect that responds to audio
const AudioResponsiveParticles = ({ playing, intensity = 0.5 }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (!playing) return;
    
    // Create initial particles
    setParticles(Array(20).fill().map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 2 * intensity,
      speedY: (Math.random() - 0.5) * 2 * intensity,
      opacity: Math.random() * 0.5 + 0.3,
    })));
    
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => {
        // Add some randomness to simulate audio response
        const audioFactor = playing ? (Math.sin(Date.now() / 1000) + 1.5) * intensity : 0;
        
        return {
          ...particle,
          x: (particle.x + particle.speedX + audioFactor) % window.innerWidth,
          y: (particle.y + particle.speedY + audioFactor) % window.innerHeight,
          opacity: 0.3 + audioFactor * 0.2,
        };
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, [playing, intensity]);
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-white"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: particle.opacity,
          }}
          transition={{
            type: "tween",
            ease: "linear",
            duration: 0.05,
          }}
        />
      ))}
    </div>
  );
};

// Progress bar with gradient
const ProgressBar = ({ progress, duration }) => {
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-sm text-white/70 mb-1">
        <span>{formatTime(progress * duration * 60)}</span>
        <span>{formatTime(duration * 60)}</span>
      </div>
      <div className="h-1 bg-white/20 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
          style={{ width: `${progress * 100}%` }}
          transition={{ type: "tween" }}
        />
      </div>
    </div>
  );
};

const MeditationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useAppContext();
  
  // Find meditation data by ID
  const meditation = meditationData.find(m => m.id === id) || meditationData[0];
  
  // State
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState({ narration: 0.8, background: 0.5 });
  const [muted, setMuted] = useState(false);
  
  // Play/pause meditation
  const togglePlay = () => {
    setPlaying(!playing);
  };
  
  // Simulate progress
  useEffect(() => {
    if (!playing) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          setPlaying(false);
          clearInterval(interval);
          return 1;
        }
        return prev + 0.001;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [playing]);
  
  return (
    <motion.div
      className={`min-h-screen pt-10 pb-24 px-6 bg-gradient-to-br ${meditation.color}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Background effects */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <AudioResponsiveParticles playing={playing} intensity={0.5} />
            <MandalaAnimation playing={playing} animationStyle={meditation.backgroundAnimation} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content */}
      <div className="relative z-10">
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
            onClick={() => toggleFavorite(meditation.id, 'meditation')}
          >
            {isFavorite(meditation.id, 'meditation') ? (
              <FaHeart className="text-red-400" />
            ) : (
              <FaRegHeart className="text-white" />
            )}
          </motion.button>
        </motion.div>
        
        {/* Meditation info */}
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <div className="text-5xl mb-4">{meditation.image}</div>
          <h1 className="text-2xl font-medium mb-2 text-white">{meditation.title}</h1>
          <p className="text-white/70 mb-2">{meditation.duration} min • {meditation.category}</p>
        </motion.div>
        
        {/* Meditation description */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="glass rounded-xl p-6 bg-white/10">
            <p className="text-white/80 leading-relaxed">{meditation.longDescription}</p>
          </div>
        </motion.div>
        
        {/* Player controls */}
        <motion.div 
          variants={itemVariants}
          className={`glass rounded-xl p-6 ${playing ? 'bg-black/20' : 'bg-white/10'} transition-colors duration-1000`}
        >
          {/* Progress bar */}
          <ProgressBar progress={progress} duration={meditation.duration} />
          
          {/* Play/pause button */}
          <div className="flex justify-center mb-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-16 h-16 rounded-full ${playing ? 'bg-white' : 'bg-gradient-to-r from-purple-400 to-pink-400'} flex items-center justify-center`}
              onClick={togglePlay}
            >
              {playing ? (
                <FaPause className={`text-2xl ${playing ? 'text-purple-500' : 'text-white'}`} />
              ) : (
                <FaPlay className="text-2xl text-white ml-1" />
              )}
            </motion.button>
          </div>
          
          {/* Volume controls */}
          <div className="grid grid-cols-2 gap-4">
            {/* Narration volume */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Narration</span>
                <button 
                  onClick={() => setMuted(!muted)}
                  className="text-white/70 hover:text-white"
                >
                  {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={muted ? 0 : volume.narration * 100}
                onChange={(e) => setVolume(prev => ({ ...prev, narration: parseInt(e.target.value) / 100 }))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                style={{
                  backgroundImage: `linear-gradient(to right, white ${muted ? 0 : volume.narration * 100}%, rgba(255,255,255,0.2) ${muted ? 0 : volume.narration * 100}%)`
                }}
              />
            </div>
            
            {/* Background volume */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Background</span>
                <FaVolumeUp className="text-white/70" />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={muted ? 0 : volume.background * 100}
                onChange={(e) => setVolume(prev => ({ ...prev, background: parseInt(e.target.value) / 100 }))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                style={{
                  backgroundImage: `linear-gradient(to right, white ${muted ? 0 : volume.background * 100}%, rgba(255,255,255,0.2) ${muted ? 0 : volume.background * 100}%)`
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MeditationDetail;
