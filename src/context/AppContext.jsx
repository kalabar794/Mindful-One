import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Check if it's night time (between 8PM and 6AM)
  const isNightTime = () => {
    const hours = new Date().getHours();
    return hours >= 20 || hours < 6;
  };

  // State
  const [theme, setTheme] = useState('dark');
  const [favorites, setFavorites] = useState([]);
  const [currentMeditation, setCurrentMeditation] = useState(null);
  const [currentStory, setCurrentStory] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState({ narration: 0.8, background: 0.5 });
  const [progress, setProgress] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    reminderTime: null,
    dailyGoal: 10, // minutes
    hapticFeedback: true,
    autoNightMode: true,
  });

  // Load saved data from localStorage
  useEffect(() => {
    const loadSavedData = () => {
      try {
        // Load favorites
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }

        // Load user preferences
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
          setUserPreferences(JSON.parse(savedPreferences));
        }

        // Load theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme);
        } else if (userPreferences.autoNightMode) {
          setTheme('dark');
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };

    loadSavedData();
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Auto switch theme based on time if autoNightMode is enabled
  useEffect(() => {
    if (!userPreferences.autoNightMode) return;

    const checkTime = () => {
      // Only switch to light mode during day, keep dark mode at night
      if (!isNightTime() && theme === 'dark') {
        // We won't automatically switch from dark to light
        // This ensures dark mode stays as default
        return;
      } else if (isNightTime() && theme === 'light') {
        // Switch to dark mode if it's night time and currently in light mode
        setTheme('dark');
      }
    };

    // Check every hour
    const interval = setInterval(checkTime, 3600000);
    return () => clearInterval(interval);
  }, [userPreferences.autoNightMode, theme]);

  // Toggle favorite
  const toggleFavorite = (id, type) => {
    const itemKey = `${type}-${id}`;
    setFavorites(prev => {
      if (prev.includes(itemKey)) {
        return prev.filter(item => item !== itemKey);
      } else {
        return [...prev, itemKey];
      }
    });
  };

  // Check if item is favorited
  const isFavorite = (id, type) => {
    const itemKey = `${type}-${id}`;
    return favorites.includes(itemKey);
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Update user preferences
  const updatePreferences = (newPreferences) => {
    setUserPreferences(prev => ({
      ...prev,
      ...newPreferences
    }));
  };

  // Context value
  const value = {
    theme,
    toggleTheme,
    favorites,
    toggleFavorite,
    isFavorite,
    currentMeditation,
    setCurrentMeditation,
    currentStory,
    setCurrentStory,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    progress,
    setProgress,
    userPreferences,
    updatePreferences,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
