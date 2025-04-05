import { useState, useEffect } from 'react';
import audioService from '../services/AudioService';

/**
 * Custom hook for audio playback
 * @param {Object} options - Hook options
 * @param {string} options.mainAudioUrl - URL for main audio track
 * @param {string} options.backgroundAudioUrl - URL for background audio track
 * @param {Function} options.onEndCallback - Callback to run when audio ends
 * @returns {Object} Audio control methods and state
 */
const useAudio = ({ mainAudioUrl, backgroundAudioUrl, onEndCallback }) => {
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  
  // Initialize audio
  useEffect(() => {
    try {
      // Load the audio files when URLs change
      if (mainAudioUrl) {
        audioService.loadSound(mainAudioUrl);
      }
      
      if (backgroundAudioUrl) {
        audioService.loadBackgroundSound(backgroundAudioUrl);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error initializing audio:', err);
      setLoading(false);
    }
  }, [mainAudioUrl, backgroundAudioUrl]);

  // Set up event listeners
  useEffect(() => {
    // Load the audio files when URLs change
    if (mainAudioUrl) {
      audioService.loadSound(mainAudioUrl);
    }
    
    if (backgroundAudioUrl) {
      audioService.loadBackgroundSound(backgroundAudioUrl);
    }
    
    // Set up event listeners
    audioService
      .onPlay(() => setPlaying(true))
      .onPause(() => setPlaying(false))
      .onEnd(() => {
        setPlaying(false);
        setProgress(1); // Complete the progress bar
        if (onEndCallback) onEndCallback();
      })
      .onProgress(setProgress);
    
    // Clean up when component unmounts
    return () => {
      audioService.destroy();
    };
  }, [mainAudioUrl, backgroundAudioUrl, onEndCallback]);
  
  // Update audio volumes when state changes
  useEffect(() => {
    audioService
      .setNarrationVolume(volume)
      .setBackgroundVolume(volume * 0.6); // Background slightly quieter than narration
  }, [volume]);
  
  // Toggle play/pause
  const togglePlay = () => {
    const isPlaying = audioService.togglePlay();
    setPlaying(isPlaying);
  };
  
  // Toggle mute
  const toggleMute = () => {
    const isMuted = audioService.toggleMute();
    setMuted(isMuted);
  };
  
  // Seek to position
  const seek = (newProgress) => {
    audioService.seek(newProgress);
    setProgress(newProgress);
  };
  
  return {
    loading,
    playing,
    muted,
    volume,
    progress,
    togglePlay,
    toggleMute,
    seek,
    setVolume
  };
};

export default useAudio;
