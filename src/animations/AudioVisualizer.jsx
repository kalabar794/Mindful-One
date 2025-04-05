import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import audioService from '../services/AudioService';

/**
 * Audio visualization component that responds to meditation audio
 * @param {Object} props - Component props
 * @param {boolean} props.isPlaying - Whether audio is currently playing
 * @param {number} props.intensity - Visualization intensity (0-1)
 * @param {string} props.type - Visualization type ('wave', 'circle', 'particles')
 * @param {string} props.color - Base color for visualization
 * @returns {JSX.Element} Audio visualization component
 */
const AudioVisualizer = ({ 
  isPlaying = false, 
  intensity = 0.5,
  type = 'wave',
  color = 'rgba(255, 255, 255, 0.5)'
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Update canvas dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    };
    
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Draw visualization
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const draw = () => {
      // Get frequency data from AudioService
      const dataArray = audioService.getFrequencyData();
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // If not playing, just show a subtle placeholder animation
      if (!isPlaying) {
        // Draw a subtle pulsing circle
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.min(canvas.width, canvas.height) / 6;
        const time = Date.now() / 1000;
        const radius = maxRadius * (0.8 + 0.2 * Math.sin(time * 2));
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = adjustColor(color, -30);
        ctx.globalAlpha = 0.2;
        ctx.fill();
        
        requestRef.current = requestAnimationFrame(draw);
        return;
      }
      
      if (!dataArray) {
        // If no real data yet, use dummy data for initial visualization
        const dummyData = new Uint8Array(128);
        for (let i = 0; i < dummyData.length; i++) {
          dummyData[i] = Math.random() * 100;
        }
        
        // Choose visualization type
        switch (type) {
          case 'wave':
            drawWaveform(ctx, dummyData, canvas.width, canvas.height, color, intensity);
            break;
          case 'circle':
            drawCircle(ctx, dummyData, canvas.width, canvas.height, color, intensity);
            break;
          case 'particles':
            drawParticles(ctx, dummyData, canvas.width, canvas.height, color, intensity);
            break;
          default:
            drawWaveform(ctx, dummyData, canvas.width, canvas.height, color, intensity);
        }
      } else {
        // Choose visualization type
        switch (type) {
          case 'wave':
            drawWaveform(ctx, dataArray, canvas.width, canvas.height, color, intensity);
            break;
          case 'circle':
            drawCircle(ctx, dataArray, canvas.width, canvas.height, color, intensity);
            break;
          case 'particles':
            drawParticles(ctx, dataArray, canvas.width, canvas.height, color, intensity);
            break;
          default:
            drawWaveform(ctx, dataArray, canvas.width, canvas.height, color, intensity);
        }
      }
      
      requestRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, dimensions, type, color, intensity]);
  
  // Waveform visualization
  const drawWaveform = (ctx, dataArray, width, height, color, intensity) => {
    const barWidth = width / dataArray.length;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, width, height);
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, adjustColor(color, 20));
    gradient.addColorStop(1, adjustColor(color, -20));
    
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    // Draw the top part of the waveform
    for (let i = 0; i < dataArray.length; i++) {
      const x = i * barWidth;
      const barHeight = (dataArray[i] / 255) * height * intensity;
      const y = height - barHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        // Use quadratic curves for smoother waveform
        const prevX = (i - 1) * barWidth;
        const prevY = height - (dataArray[i - 1] / 255) * height * intensity;
        const cpX = (prevX + x) / 2;
        ctx.quadraticCurveTo(cpX, prevY, x, y);
      }
    }
    
    // Complete the path to create a filled shape
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.7;
    ctx.fill();
    
    // Add a stroke
    ctx.strokeStyle = adjustColor(color, 50);
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.8;
    ctx.stroke();
  };
  
  // Circle visualization
  const drawCircle = (ctx, dataArray, width, height, color, intensity) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;
    
    // Create gradient
    const gradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.5,
      centerX, centerY, radius * 2
    );
    gradient.addColorStop(0, adjustColor(color, 50));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    // Draw circles based on frequency data
    const angleStep = (2 * Math.PI) / dataArray.length;
    
    for (let i = 0; i < dataArray.length; i++) {
      const value = dataArray[i] / 255;
      const dynamicRadius = radius + (value * radius * intensity);
      const angle = i * angleStep;
      
      const x = centerX + Math.cos(angle) * dynamicRadius;
      const y = centerY + Math.sin(angle) * dynamicRadius;
      
      ctx.beginPath();
      ctx.arc(x, y, 2 + value * 5 * intensity, 0, 2 * Math.PI);
      ctx.fillStyle = adjustColor(color, value * 30);
      ctx.fill();
      
      // Connect to center with lines
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = adjustColor(color, value * 20);
      ctx.globalAlpha = 0.3 + value * 0.3;
      ctx.lineWidth = 1 + value * 2;
      ctx.stroke();
    }
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.7;
    ctx.fill();
  };
  
  // Particles visualization
  const drawParticles = (ctx, dataArray, width, height, color, intensity) => {
    // Calculate average frequency value
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    const normalizedAvg = average / 255;
    
    // Create particles
    const particleCount = 50;
    const centerX = width / 2;
    const centerY = height / 2;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = (normalizedAvg * 100 * intensity) + 50;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      const particleSize = 2 + normalizedAvg * 8 * intensity;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(x, y, particleSize, 0, Math.PI * 2);
      ctx.fillStyle = adjustColor(color, i % 30);
      ctx.globalAlpha = 0.5 + normalizedAvg * 0.5;
      ctx.fill();
      
      // Draw connecting lines between particles
      if (i > 0) {
        const prevAngle = ((i - 1) / particleCount) * Math.PI * 2;
        const prevX = centerX + Math.cos(prevAngle) * distance;
        const prevY = centerY + Math.sin(prevAngle) * distance;
        
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = adjustColor(color, -20);
        ctx.globalAlpha = 0.2 + normalizedAvg * 0.3;
        ctx.lineWidth = 1 + normalizedAvg * 2 * intensity;
        ctx.stroke();
      }
    }
  };
  
  // Helper function to adjust color brightness
  const adjustColor = (color, amount) => {
    // For rgba colors
    if (color.startsWith('rgba')) {
      const rgba = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([.\d]+)\)/);
      if (rgba) {
        const r = Math.max(0, Math.min(255, parseInt(rgba[1]) + amount));
        const g = Math.max(0, Math.min(255, parseInt(rgba[2]) + amount));
        const b = Math.max(0, Math.min(255, parseInt(rgba[3]) + amount));
        const a = rgba[4];
        return `rgba(${r}, ${g}, ${b}, ${a})`;
      }
    }
    
    // For hex colors
    if (color.startsWith('#')) {
      let hex = color.slice(1);
      
      // Convert 3-digit hex to 6-digit
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      
      const adjustR = Math.max(0, Math.min(255, r + amount));
      const adjustG = Math.max(0, Math.min(255, g + amount));
      const adjustB = Math.max(0, Math.min(255, b + amount));
      
      return `#${adjustR.toString(16).padStart(2, '0')}${adjustG.toString(16).padStart(2, '0')}${adjustB.toString(16).padStart(2, '0')}`;
    }
    
    return color;
  };
  
  // Render canvas for visualization
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: isPlaying ? 1 : 0, transition: 'opacity 0.5s ease' }}
      />
      
      {/* Placeholder when not playing */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-center text-white/50"
          >
            <p className="text-sm">Play to see visualization</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AudioVisualizer;
