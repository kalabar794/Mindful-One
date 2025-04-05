import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const BackgroundEffects = () => {
  const { theme } = useAppContext();
  const canvasRef = useRef(null);
  
  // Dynamic gradient background based on theme
  const gradientColors = {
    light: {
      from: 'from-lavender',
      via: 'via-babyblue',
      to: 'to-mint',
    },
    dark: {
      from: 'from-darklavender',
      via: 'via-darkblue',
      to: 'to-darkpink',
    }
  };

  // Canvas animation for subtle flowing background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Animation parameters
    let time = 0;
    const colors = theme === 'dark' 
      ? ['rgba(147, 112, 219, 0.2)', 'rgba(100, 149, 237, 0.2)', 'rgba(219, 112, 147, 0.2)']
      : ['rgba(230, 230, 250, 0.2)', 'rgba(173, 216, 230, 0.2)', 'rgba(152, 251, 152, 0.2)'];
    
    // Draw wave animation
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw multiple wave layers
      for (let i = 0; i < 3; i++) {
        const amplitude = 20 + i * 10; // Height of the wave
        const period = 0.01 - i * 0.002; // How many waves
        const speed = 0.0005 + i * 0.0001; // Wave speed
        
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        
        // Create wave path
        for (let x = 0; x < canvas.width; x++) {
          const y = Math.sin(x * period + time * speed) * amplitude + 
                   canvas.height / 2 + (i * canvas.height / 8);
          ctx.lineTo(x, y);
        }
        
        // Complete the wave path
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        // Fill with gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, colors[i % colors.length]);
        gradient.addColorStop(0.5, colors[(i + 1) % colors.length]);
        gradient.addColorStop(1, colors[(i + 2) % colors.length]);
        
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      time += 1;
      animationFrameId = window.requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme]);
  
  return (
    <>
      {/* Base gradient background */}
      <div className={`fixed inset-0 bg-gradient-to-br ${gradientColors[theme].from} ${gradientColors[theme].via} ${gradientColors[theme].to} transition-colors duration-1000`} />
      
      {/* Canvas for animated waves */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-0 opacity-50"
      />
      
      {/* Floating circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'}`}
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Light rays effect (only in dark mode) */}
      {theme === 'dark' && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/5 blur-3xl"
              style={{
                width: '300px',
                height: '800px',
                left: `${i * 30 + 20}%`,
                top: '-400px',
                transform: 'rotate(30deg)',
              }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default BackgroundEffects;
