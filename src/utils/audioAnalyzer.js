/**
 * Utility for connecting Howler.js audio to Web Audio API for visualization
 */

// Global audio context
let audioContext = null;
let analyzer = null;
let dataArray = null;
let source = null;
let isConnected = false;

/**
 * Initialize the audio analyzer
 * @returns {Object} The analyzer and data array
 */
export const initializeAnalyzer = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      const bufferLength = analyzer.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      
      // Connect analyzer to destination
      analyzer.connect(audioContext.destination);
    } catch (error) {
      console.error('Failed to initialize audio analyzer:', error);
    }
  }
  
  return { analyzer, dataArray };
};

/**
 * Connect a Howler sound to the analyzer
 * @param {Object} howl - Howler sound object
 * @returns {boolean} Whether connection was successful
 */
export const connectHowlerToAnalyzer = (howl) => {
  if (!howl || !analyzer) return false;
  
  try {
    // Disconnect previous source if exists
    if (source) {
      source.disconnect();
    }
    
    // Get the Howler audio node
    const howlNode = howl._sounds[0]?._node;
    
    if (!howlNode) {
      console.warn('No audio node found in Howler instance');
      return false;
    }
    
    // Create a media element source
    source = audioContext.createMediaElementSource(howlNode);
    
    // Connect source to analyzer and destination
    source.connect(analyzer);
    
    isConnected = true;
    return true;
  } catch (error) {
    console.error('Failed to connect Howler to analyzer:', error);
    return false;
  }
};

/**
 * Get frequency data from the analyzer
 * @returns {Uint8Array|null} Frequency data array or null if not initialized
 */
export const getFrequencyData = () => {
  if (!analyzer || !dataArray) return null;
  
  analyzer.getByteFrequencyData(dataArray);
  return dataArray;
};

/**
 * Check if analyzer is connected to an audio source
 * @returns {boolean} Connection status
 */
export const isAnalyzerConnected = () => isConnected;

/**
 * Clean up audio analyzer resources
 */
export const cleanupAnalyzer = () => {
  if (source) {
    source.disconnect();
    source = null;
  }
  
  isConnected = false;
};

export default {
  initializeAnalyzer,
  connectHowlerToAnalyzer,
  getFrequencyData,
  isAnalyzerConnected,
  cleanupAnalyzer
};
