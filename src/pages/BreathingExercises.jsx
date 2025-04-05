import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// Breathing techniques data
const breathingTechniques = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Inhale, hold, exhale, and hold again for equal counts to reduce stress and improve focus.',
    pattern: { inhale: 4, inhaleHold: 4, exhale: 4, exhaleHold: 4 },
    color: 'from-lavender to-babyblue',
    icon: '🔄'
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8. Promotes relaxation and helps with anxiety and sleep.',
    pattern: { inhale: 4, inhaleHold: 7, exhale: 8, exhaleHold: 0 },
    color: 'from-mint to-babyblue',
    icon: '😌'
  },
  {
    id: 'diaphragmatic',
    name: 'Diaphragmatic Breathing',
    description: 'Deep belly breathing that engages the diaphragm fully for maximum oxygen exchange.',
    pattern: { inhale: 5, inhaleHold: 2, exhale: 6, exhaleHold: 0 },
    color: 'from-palepink to-lavender',
    icon: '🫁'
  },
  {
    id: 'alternate-nostril',
    name: 'Alternate Nostril',
    description: 'Balance your nervous system with this yogic breathing technique.',
    pattern: { inhale: 4, inhaleHold: 4, exhale: 6, exhaleHold: 2 },
    color: 'from-babyblue to-mint',
    icon: '👃'
  },
  {
    id: 'calm',
    name: 'Calming Breath',
    description: 'Longer exhales than inhales to activate the parasympathetic nervous system.',
    pattern: { inhale: 4, inhaleHold: 0, exhale: 8, exhaleHold: 0 },
    color: 'from-lavender to-palepink',
    icon: '🧘‍♀️'
  }
];

// Breathing exercise component with beautiful animations
const BreathingExercise = ({ technique, onClose }) => {
  const [phase, setPhase] = useState('ready'); // ready, inhale, inhaleHold, exhale, exhaleHold
  const [count, setCount] = useState(3);
  const [cycles, setCycles] = useState(0);
  const { userPreferences } = useAppContext();
  const maxCycles = 10;
  
  // Use refs to track animation state
  const timerRef = useRef(null);
  const phaseTimerRef = useRef(null);
  
  // Haptic feedback function
  const triggerHapticFeedback = () => {
    if (userPreferences.hapticFeedback && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };
  
  // Initialize breathing exercise
  useEffect(() => {
    // Start with a countdown
    timerRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setPhase('inhale');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(phaseTimerRef.current);
    };
  }, []);
  
  // Handle phase changes
  useEffect(() => {
    if (phase === 'ready') return;
    if (cycles >= maxCycles) {
      setPhase('complete');
      return;
    }
    
    triggerHapticFeedback();
    
    const phaseDurations = {
      inhale: technique.pattern.inhale * 1000,
      inhaleHold: technique.pattern.inhaleHold * 1000,
      exhale: technique.pattern.exhale * 1000,
      exhaleHold: technique.pattern.exhaleHold * 1000
    };
    
    const nextPhases = {
      inhale: technique.pattern.inhaleHold > 0 ? 'inhaleHold' : 'exhale',
      inhaleHold: 'exhale',
      exhale: technique.pattern.exhaleHold > 0 ? 'exhaleHold' : 'inhale',
      exhaleHold: 'inhale'
    };
    
    phaseTimerRef.current = setTimeout(() => {
      const nextPhase = nextPhases[phase];
      setPhase(nextPhase);
      
      // Increment cycle count when we complete a full cycle
      if (nextPhase === 'inhale' && phase !== 'ready') {
        setCycles(prev => prev + 1);
      }
    }, phaseDurations[phase]);
    
    return () => clearTimeout(phaseTimerRef.current);
  }, [phase, cycles, technique]);
  
  // Get instruction text based on current phase
  const getInstructionText = () => {
    switch (phase) {
      case 'ready':
        return `Starting in ${count}...`;
      case 'inhale':
        return 'Breathe in';
      case 'inhaleHold':
        return 'Hold';
      case 'exhale':
        return 'Breathe out';
      case 'exhaleHold':
        return 'Hold';
      case 'complete':
        return 'Great job!';
      default:
        return '';
    }
  };
  
  // Animation properties based on current phase
  const getAnimationProps = () => {
    switch (phase) {
      case 'inhale':
        return {
          scale: [1, 1.5],
          opacity: [0.7, 1],
          transition: { duration: technique.pattern.inhale, ease: "easeInOut" }
        };
      case 'inhaleHold':
        return {
          scale: 1.5,
          opacity: 1,
          transition: { duration: technique.pattern.inhaleHold }
        };
      case 'exhale':
        return {
          scale: [1.5, 1],
          opacity: [1, 0.7],
          transition: { duration: technique.pattern.exhale, ease: "easeInOut" }
        };
      case 'exhaleHold':
        return {
          scale: 1,
          opacity: 0.7,
          transition: { duration: technique.pattern.exhaleHold }
        };
      case 'complete':
        return {
          scale: [1, 1.2, 1],
          opacity: 1,
          transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
        };
      default:
        return {
          scale: 1,
          opacity: 0.7
        };
    }
  };
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className={`w-full max-w-md p-6 rounded-2xl bg-gradient-to-br ${technique.color} glass`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium mb-2">{technique.name}</h2>
          <p className="text-sm opacity-80">{technique.description}</p>
        </div>
        
        {/* Breathing visualization */}
        <div className="flex flex-col items-center justify-center mb-8">
          {/* Progress indicator */}
          <div className="w-full h-2 bg-white/30 rounded-full mb-8 overflow-hidden">
            <motion.div 
              className="h-full bg-white/60"
              initial={{ width: '0%' }}
              animate={{ width: `${(cycles / maxCycles) * 100}%` }}
              transition={{ type: "tween" }}
            />
          </div>
          
          {/* Breathing circle animation */}
          <div className="relative flex items-center justify-center mb-8">
            {/* Ripple effect */}
            {phase === 'inhale' && (
              <motion.div
                className="absolute rounded-full border-2 border-white/30"
                initial={{ width: 50, height: 50, opacity: 1 }}
                animate={{ 
                  width: 300, 
                  height: 300, 
                  opacity: 0,
                  borderWidth: 0
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: technique.pattern.inhale,
                  ease: "easeOut"
                }}
              />
            )}
            
            {/* Main breathing circle */}
            <motion.div
              className="relative w-40 h-40 rounded-full bg-white/30 flex items-center justify-center"
              animate={getAnimationProps()}
            >
              <span className="text-4xl">{technique.icon}</span>
            </motion.div>
          </div>
          
          {/* Instruction text */}
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <h3 className="text-2xl font-light mb-1">{getInstructionText()}</h3>
            <p className="text-sm opacity-80">Cycle {cycles} of {maxCycles}</p>
          </motion.div>
        </div>
        
        {/* Controls */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 rounded-full bg-white/30 hover:bg-white/40"
            onClick={onClose}
          >
            {phase === 'complete' ? 'Done' : 'End Session'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Custom breathing session builder
const CustomBreathingBuilder = ({ onStart }) => {
  const [customPattern, setCustomPattern] = useState({
    inhale: 4,
    inhaleHold: 2,
    exhale: 6,
    exhaleHold: 0
  });
  
  const handleChange = (field, value) => {
    setCustomPattern(prev => ({
      ...prev,
      [field]: Math.max(0, Math.min(10, parseInt(value) || 0))
    }));
  };
  
  return (
    <motion.div 
      variants={itemVariants}
      className="glass rounded-xl p-6 mb-6"
    >
      <h3 className="text-lg font-medium mb-4">Custom Breathing Pattern</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.entries({
          inhale: 'Inhale (s)',
          inhaleHold: 'Hold (s)',
          exhale: 'Exhale (s)',
          exhaleHold: 'Hold after exhale (s)'
        }).map(([key, label]) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm mb-1">{label}</label>
            <div className="flex items-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center"
                onClick={() => handleChange(key, customPattern[key] - 1)}
              >
                -
              </motion.button>
              <input
                type="number"
                min="0"
                max="10"
                value={customPattern[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-12 mx-2 text-center bg-white/20 rounded-md p-1"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center"
                onClick={() => handleChange(key, customPattern[key] + 1)}
              >
                +
              </motion.button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white"
          onClick={() => onStart({
            id: 'custom',
            name: 'Custom Breathing',
            description: 'Your personalized breathing pattern',
            pattern: customPattern,
            color: 'from-purple-400 to-pink-400',
            icon: '✨'
          })}
        >
          Start Custom Session
        </motion.button>
      </div>
    </motion.div>
  );
};

// Technique card component
const TechniqueCard = ({ technique, onSelect }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="glass rounded-xl overflow-hidden cursor-pointer"
      onClick={() => onSelect(technique)}
    >
      <div className={`p-5 bg-gradient-to-br ${technique.color}`}>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium">{technique.name}</h3>
          <span className="text-2xl">{technique.icon}</span>
        </div>
        <p className="text-sm opacity-80 mb-3">{technique.description}</p>
        
        <div className="flex space-x-2 text-xs opacity-70">
          <span>Inhale: {technique.pattern.inhale}s</span>
          {technique.pattern.inhaleHold > 0 && (
            <span>• Hold: {technique.pattern.inhaleHold}s</span>
          )}
          <span>• Exhale: {technique.pattern.exhale}s</span>
          {technique.pattern.exhaleHold > 0 && (
            <span>• Hold: {technique.pattern.exhaleHold}s</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const BreathingExercises = () => {
  const [activeTechnique, setActiveTechnique] = useState(null);
  
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
        <h1 className="text-2xl font-medium mb-2">Breathing Exercises</h1>
        <p className="text-gray-600 dark:text-gray-300">Calm your mind with guided breathing</p>
      </motion.div>
      
      {/* Custom breathing builder */}
      <CustomBreathingBuilder onStart={setActiveTechnique} />
      
      {/* Techniques grid */}
      <motion.div variants={itemVariants} className="mb-4">
        <h2 className="text-xl font-medium">Breathing Techniques</h2>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20"
        variants={containerVariants}
      >
        {breathingTechniques.map(technique => (
          <TechniqueCard 
            key={technique.id} 
            technique={technique} 
            onSelect={setActiveTechnique} 
          />
        ))}
      </motion.div>
      
      {/* Active breathing exercise */}
      <AnimatePresence>
        {activeTechnique && (
          <BreathingExercise 
            technique={activeTechnique} 
            onClose={() => setActiveTechnique(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BreathingExercises;
