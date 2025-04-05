import { Howl } from 'howler';

class AudioService {
  constructor() {
    this.sound = null;
    this.backgroundSound = null;
    this.volume = { narration: 0.8, background: 0.5 };
    this.muted = false;
    this.onPlayCallbacks = [];
    this.onPauseCallbacks = [];
    this.onEndCallbacks = [];
    this.onProgressCallbacks = [];
    
    // Web Audio API for visualization
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.animationFrame = null;
    
    // Initialize Web Audio API if available
    this.initializeWebAudio();
  }
  
  // Initialize Web Audio API for visualization
  initializeWebAudio() {
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
        
        // Connect analyzer to destination
        this.analyser.connect(this.audioContext.destination);
      } catch (error) {
        console.error('Failed to initialize Web Audio API:', error);
      }
    }
  }
  
  // Connect Howler sound to Web Audio API
  connectToAnalyser(howl) {
    if (!howl || !this.analyser || !this.audioContext) return;
    
    try {
      // Get the Howler audio node
      const node = howl._sounds[0]?._node;
      
      if (!node) {
        console.warn('No audio node found in Howler instance');
        return;
      }
      
      // Create a media element source
      try {
        const source = this.audioContext.createMediaElementSource(node);
        
        // Connect source to analyzer and destination
        source.connect(this.analyser);
        source.connect(this.audioContext.destination);
      } catch (e) {
        // Handle the case where the node is already connected
        console.warn('Audio node might already be connected:', e.message);
      }
    } catch (error) {
      console.error('Failed to connect to analyzer:', error);
    }
  }
  
  // Get frequency data for visualization
  getFrequencyData() {
    if (!this.analyser || !this.dataArray) return null;
    
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }
  
  // Load main narration track
  loadSound(audioUrl) {
    if (this.sound) {
      this.sound.stop();
      this.sound.unload();
    }
    
    if (!audioUrl) {
      console.warn('No audio URL provided');
      return this;
    }
    
    this.sound = new Howl({
      src: [audioUrl],
      html5: true,
      volume: this.muted ? 0 : this.volume.narration,
      onplay: () => this.onPlayCallbacks.forEach(cb => cb()),
      onpause: () => this.onPauseCallbacks.forEach(cb => cb()),
      onend: () => this.onEndCallbacks.forEach(cb => cb()),
      onloaderror: (id, error) => console.error('Error loading audio:', error)
    });
    
    // Connect to analyzer when loaded
    this.sound.once('load', () => {
      this.connectToAnalyser(this.sound);
      this.startProgressTracking();
    });
    
    return this;
  }
  
  // Load background ambient sound
  loadBackgroundSound(audioUrl) {
    if (this.backgroundSound) {
      this.backgroundSound.stop();
      this.backgroundSound.unload();
    }
    
    if (!audioUrl) return this;
    
    this.backgroundSound = new Howl({
      src: [audioUrl],
      html5: true,
      volume: this.muted ? 0 : this.volume.background,
      loop: true
    });
    
    return this;
  }
  
  // Play both sounds
  play() {
    if (this.sound) {
      this.sound.play();
      
      // Resume audio context if suspended
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    }
    
    if (this.backgroundSound) {
      this.backgroundSound.play();
    }
    
    return this;
  }
  
  // Pause both sounds
  pause() {
    if (this.sound) {
      this.sound.pause();
    }
    
    if (this.backgroundSound) {
      this.backgroundSound.pause();
    }
    
    return this;
  }
  
  // Toggle play/pause
  togglePlay() {
    const isPlaying = this.sound && this.sound.playing();
    
    if (isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    
    return !isPlaying;
  }
  
  // Set volume for narration
  setNarrationVolume(value) {
    this.volume.narration = value;
    
    if (this.sound && !this.muted) {
      this.sound.volume(value);
    }
    
    return this;
  }
  
  // Set volume for background sound
  setBackgroundVolume(value) {
    this.volume.background = value;
    
    if (this.backgroundSound && !this.muted) {
      this.backgroundSound.volume(value);
    }
    
    return this;
  }
  
  // Toggle mute for all sounds
  toggleMute() {
    this.muted = !this.muted;
    
    const narrationVolume = this.muted ? 0 : this.volume.narration;
    const backgroundVolume = this.muted ? 0 : this.volume.background;
    
    if (this.sound) {
      this.sound.volume(narrationVolume);
    }
    
    if (this.backgroundSound) {
      this.backgroundSound.volume(backgroundVolume);
    }
    
    return this.muted;
  }
  
  // Seek to a specific position (0-1)
  seek(position) {
    if (!this.sound) return this;
    
    const duration = this.sound.duration();
    if (duration) {
      this.sound.seek(position * duration);
    }
    
    return this;
  }
  
  // Get current progress (0-1)
  getProgress() {
    if (!this.sound) return 0;
    
    const duration = this.sound.duration();
    if (!duration) return 0;
    
    return this.sound.seek() / duration;
  }
  
  // Start tracking progress
  startProgressTracking() {
    const updateProgress = () => {
      const progress = this.getProgress();
      this.onProgressCallbacks.forEach(cb => cb(progress));
      
      // Continue tracking if playing
      if (this.sound && this.sound.playing()) {
        this.animationFrame = requestAnimationFrame(updateProgress);
      }
    };
    
    // Cancel previous animation frame if exists
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    this.animationFrame = requestAnimationFrame(updateProgress);
  }
  
  // Event handlers
  onPlay(callback) {
    this.onPlayCallbacks.push(callback);
    return this;
  }
  
  onPause(callback) {
    this.onPauseCallbacks.push(callback);
    return this;
  }
  
  onEnd(callback) {
    this.onEndCallbacks.push(callback);
    return this;
  }
  
  onProgress(callback) {
    this.onProgressCallbacks.push(callback);
    return this;
  }
  
  // Clean up resources
  destroy() {
    if (this.sound) {
      this.sound.stop();
      this.sound.unload();
      this.sound = null;
    }
    
    if (this.backgroundSound) {
      this.backgroundSound.stop();
      this.backgroundSound.unload();
      this.backgroundSound = null;
    }
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    this.onPlayCallbacks = [];
    this.onPauseCallbacks = [];
    this.onEndCallbacks = [];
    this.onProgressCallbacks = [];
    
    return this;
  }
}

// Create a singleton instance
const audioService = new AudioService();

export default audioService;
