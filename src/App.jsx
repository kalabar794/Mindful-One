import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAppContext } from './context/AppContext';
import './App.css';

// Pages
import Home from './pages/Home';
import Meditations from './pages/Meditations';
import SleepStories from './pages/SleepStories';
import BreathingExercises from './pages/BreathingExercises';
import Profile from './pages/Profile';
import MeditationDetail from './pages/MeditationDetail';
import StoryDetail from './pages/StoryDetail';

// Components
import Navigation from './components/Navigation';
import BackgroundEffects from './animations/BackgroundEffects';
import ParticleBackground from './animations/ParticleBackground';

function App() {
  const location = useLocation();
  const { theme } = useAppContext();
  
  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'night-mode' : 'day-mode';
  }, [theme]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background animations */}
      <BackgroundEffects />
      <ParticleBackground />
      
      {/* Main content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/meditations" element={<Meditations />} />
            <Route path="/meditations/:id" element={<MeditationDetail />} />
            <Route path="/sleep-stories" element={<SleepStories />} />
            <Route path="/sleep-stories/:id" element={<StoryDetail />} />
            <Route path="/breathing" element={<BreathingExercises />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AnimatePresence>
        
        {/* Navigation */}
        <Navigation />
      </div>
    </div>
  );
}

export default App;
