import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaStar } from 'react-icons/fa';
import './ThemeToggle.scss';

const ThemeToggle: React.FC = () => {
  // État local qui suit le thème actuel
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Récupère la préférence initiale du système
  useEffect(() => {
    const prefersDarkMode = window.matchMedia && 
                           window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-theme');
    }
  }, []);
  
  // Applique le changement de thème
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }
    
    setIsDarkMode(!isDarkMode);
  };

  // Variantes d'animation pour les icônes
  const iconVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.6, 
      rotate: -30 
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 200
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.6, 
      rotate: 30,
      transition: { 
        duration: 0.2 
      }
    }
  };
  
  // Variantes pour les particules autour de l'icône
  const particleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: (i: number) => ({
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      x: [0, (i % 2 === 0 ? 20 : -20) * Math.random()],
      y: [0, (i % 2 === 0 ? -20 : 20) * Math.random()],
      transition: {
        duration: 1,
        delay: Math.random() * 0.2,
        repeat: 0,
        repeatType: "reverse" as const
      }
    })
  };

  return (
    <div className="theme-toggle">
      <motion.button 
        className="theme-toggle-button"
        onClick={toggleTheme}
        aria-label={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
        whileTap={{ scale: 0.9 }}
        whileHover={{ 
          scale: 1.1,
          boxShadow: isDarkMode 
            ? "0 0 15px rgba(255, 215, 0, 0.5)" 
            : "0 0 15px rgba(100, 100, 255, 0.5)"
        }}
      >
        <div className="toggle-icon-container">
          <AnimatePresence mode="wait">
            {isDarkMode ? (
              <motion.div
                key="moon"
                className="icon-wrapper"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <FaMoon className="moon-icon" />
                {/* Effet d'étoiles autour de la lune */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`star-${i}`}
                    className="particle star"
                    custom={i}
                    variants={particleVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <FaStar size={8} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                className="icon-wrapper"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <FaSun className="sun-icon" />
                {/* Effet de rayons autour du soleil */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`ray-${i}`}
                    className="particle ray"
                    style={{ 
                      rotate: `${i * 60}deg`,
                      originX: "50%",
                      originY: "50%"
                    }}
                    custom={i}
                    variants={particleVariants}
                    initial="initial"
                    animate="animate"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  );
};

export default ThemeToggle; 