import React, { useCallback } from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import { useAppContext } from '../context/AppContext';

const ParticleBackground = () => {
  const { theme } = useAppContext();
  
  // Particle colors based on theme
  const particleColors = theme === 'dark' 
    ? ['#E6E6FA', '#ADD8E6', '#FFCFDA'] 
    : ['#9370DB', '#6495ED', '#DB7093'];
  
  // Initialize particles engine
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Particle configuration
  const options = {
    fullScreen: {
      enable: true,
      zIndex: 1
    },
    particles: {
      number: {
        value: 15,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: particleColors
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000"
        }
      },
      opacity: {
        value: 0.3,
        random: true,
        anim: {
          enable: true,
          speed: 0.2,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 8,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: theme === 'dark' ? "#ffffff" : "#8080ff",
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 0.5
          }
        },
        push: {
          particles_nb: 3
        }
      }
    },
    retina_detect: true,
    background: {
      color: "transparent",
      image: "",
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover"
    }
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={options}
      className="fixed inset-0 pointer-events-auto"
    />
  );
};

export default ParticleBackground;
