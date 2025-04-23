import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FaTwitch, FaDiscord, FaTwitter, FaBars, FaTimes, FaHeart, FaLock } from 'react-icons/fa';
import ThemeToggle from '../common/ThemeToggle';
import './Header.scss';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminKeyPressed, setAdminKeyPressed] = useState(false);
  const location = useLocation();
  
  // Animation basée sur le scroll
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 50], [1, 0.97]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 12]);
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.98]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.92]);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let ctrlPressed = false;
    let shiftPressed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') ctrlPressed = true;
      if (e.key === 'Shift') shiftPressed = true;
      if (e.key === 'a' || e.key === 'A') {
        if (ctrlPressed && shiftPressed) {
          setAdminKeyPressed(true);
          setTimeout(() => setAdminKeyPressed(false), 3000); // Masquer après 3 secondes
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') ctrlPressed = false;
      if (e.key === 'Shift') shiftPressed = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { title: 'Accueil', path: '/' },
    { title: 'Souvenirs', path: '/memories' },
    { title: 'Remerciements', path: '/remerciements' },
  ];
  
  // Animation du logo
  const logoVariants = {
    rest: { 
      scale: 1,
      transition: { duration: 0.4 } 
    },
    hover: { 
      scale: 1.05,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    }
  };
  
  // Animation des liens de navigation
  const navItemVariants = {
    rest: { 
      y: 0,
      transition: { duration: 0.3 } 
    },
    hover: { 
      y: -4,
      color: 'var(--accent-color)',
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    }
  };
  
  // Animation pour la bordure sous les liens actifs
  const activeIndicatorVariants = {
    initial: { width: 0, opacity: 0 },
    animate: { 
      width: '70%', 
      opacity: 1,
      transition: { duration: 0.4, type: "spring", stiffness: 300 } 
    },
    exit: { 
      width: 0, 
      opacity: 0,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <motion.header 
      className={`header ${isScrolled ? 'scrolled' : ''}`}
      style={{ 
        opacity: headerOpacity,
        backdropFilter: `blur(${headerBlur.get()}px)`,
        scale: headerScale
      }}
    >
      <div className="container header-container">
        <motion.div 
          className="logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          variants={logoVariants}
          whileHover="hover"
          whileTap={{ scale: 0.95 }}
          style={{ scale: logoScale }}
        >
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="logo-wrapper"
            >
              <h1 className="site-title">
                <motion.span
                  className="logo-first"
                  animate={{ 
                    color: ["#9146FF", "#ff64b6", "#9146FF"],
                    textShadow: [
                      "0 0 5px rgba(145, 70, 255, 0.5)",
                      "0 0 10px rgba(255, 100, 182, 0.5)",
                      "0 0 5px rgba(145, 70, 255, 0.5)"
                    ]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Mawkzy
                </motion.span>{" "}
                <motion.span
                  className="logo-second"
                  animate={{ 
                    color: ["#ff64b6", "#9146FF", "#ff64b6"],
                    textShadow: [
                      "0 0 5px rgba(255, 100, 182, 0.5)",
                      "0 0 10px rgba(145, 70, 255, 0.5)",
                      "0 0 5px rgba(255, 100, 182, 0.5)"
                    ]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4
                  }}
                >
                  MemoryBook
                </motion.span>
              </h1>
              
              <motion.div 
                className="logo-underline"
                animate={{ 
                  width: ["30%", "60%", "30%"],
                  opacity: [0.6, 1, 0.6],
                  boxShadow: [
                    "0 2px 4px rgba(145, 70, 255, 0.2)",
                    "0 3px 8px rgba(255, 100, 182, 0.4)",
                    "0 2px 4px rgba(145, 70, 255, 0.2)"
                  ]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </Link>
        </motion.div>

        <nav className={`desktop-nav ${isMobileMenuOpen ? 'hide' : ''}`}>
          <ul>
            {navLinks.map((link, index) => (
              <motion.li 
                key={link.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                variants={navItemVariants}
                whileHover="hover"
              >
                <Link 
                  to={link.path} 
                  className={location.pathname === link.path ? 'active' : ''}
                >
                  {link.title}
                  {location.pathname === link.path && (
                    <motion.div 
                      className="active-indicator" 
                      variants={activeIndicatorVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      layoutId="activeNavIndicator"
                    />
                  )}
                </Link>
              </motion.li>
            ))}
            <AnimatePresence>
              {adminKeyPressed && (
                <motion.li 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    to="/admin" 
                    className="admin-link"
                  >
                    <FaLock />
                    Admin
                  </Link>
                </motion.li>
              )}
            </AnimatePresence>
            <motion.li className="theme-toggle-wrapper">
              <ThemeToggle />
            </motion.li>
          </ul>
        </nav>

        <motion.div 
          className="social-icons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {[
            { icon: <FaTwitch />, url: 'https://www.twitch.tv/mawkzy_', delay: 0.05, color: "#9146FF", hoverBg: "#9146FF" },
            { icon: <FaTwitter />, url: 'https://x.com/mawkzy1', delay: 0.1, color: "#1DA1F2", hoverBg: "#1DA1F2" },
            { icon: <FaDiscord />, url: 'https://discord.gg/wkcRDUNumc', delay: 0.15, color: "#7289DA", hoverBg: "#7289DA" },
            { icon: <FaHeart />, url: '/memories', delay: 0.2, color: "#ff64b6", hoverBg: "#ff64b6" }
          ].map((social, index) => (
            <motion.a 
              key={index}
              href={social.url} 
              target={social.url.startsWith('http') ? "_blank" : undefined}
              rel={social.url.startsWith('http') ? "noopener noreferrer" : undefined}
              whileHover={{ 
                scale: 1.2, 
                rotate: 5,
                y: -5,
                backgroundColor: social.hoverBg,
                color: "white",
                boxShadow: `0 8px 20px rgba(${social.hoverBg === "#9146FF" ? "145, 70, 255" : social.hoverBg === "#1DA1F2" ? "29, 161, 242" : social.hoverBg === "#7289DA" ? "114, 137, 218" : "255, 100, 182"}, 0.4)`
              }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + social.delay, duration: 0.3 }}
              style={{
                backgroundColor: `rgba(${social.hoverBg === "#9146FF" ? "145, 70, 255" : social.hoverBg === "#1DA1F2" ? "29, 161, 242" : social.hoverBg === "#7289DA" ? "114, 137, 218" : "255, 100, 182"}, 0.15)`,
                color: social.color
              }}
            >
              {social.icon}
            </motion.a>
          ))}
        </motion.div>

        <motion.div 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--primary-color-rgb), 0.2)' }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isMobileMenuOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: isMobileMenuOpen ? -45 : 45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: isMobileMenuOpen ? 45 : -45 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-menu open"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ 
              opacity: 1, 
              height: 'auto', 
              y: 0,
              transition: { 
                opacity: { duration: 0.3 },
                height: { duration: 0.5 },
                y: { duration: 0.3, delay: 0.1 }
              }
            }}
            exit={{ 
              opacity: 0, 
              height: 0, 
              y: -20,
              transition: { 
                opacity: { duration: 0.3 },
                height: { duration: 0.3 },
                y: { duration: 0.2 }
              }
            }}
          >
            <ul>
              {navLinks.map((link, index) => (
                <motion.li 
                  key={link.path}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: { 
                      delay: 0.1 * index,
                      duration: 0.3
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: -30,
                    transition: { 
                      delay: 0.05 * index,
                      duration: 0.2
                    }
                  }}
                >
                  <Link 
                    to={link.path} 
                    className={location.pathname === link.path ? 'active' : ''}
                    onClick={closeMobileMenu}
                  >
                    {link.title}
                  </Link>
                </motion.li>
              ))}
              <AnimatePresence>
                {adminKeyPressed && (
                  <motion.li 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link 
                      to="/admin" 
                      className="admin-link"
                      onClick={closeMobileMenu}
                    >
                      <FaLock />
                      Admin
                    </Link>
                  </motion.li>
                )}
              </AnimatePresence>
              <motion.li className="theme-toggle-wrapper">
                <ThemeToggle />
              </motion.li>
            </ul>
            
            <motion.div 
              className="mobile-social-icons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <motion.a 
                href="https://www.twitch.tv/mawkzy_" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, backgroundColor: "#9146FF", color: "white" }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTwitch />
              </motion.a>
              <motion.a 
                href="https://x.com/mawkzy1" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, backgroundColor: "#1DA1F2", color: "white" }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTwitter />
              </motion.a>
              <motion.a 
                href="https://discord.gg/wkcRDUNumc" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, backgroundColor: "#7289DA", color: "white" }}
                whileTap={{ scale: 0.9 }}
              >
                <FaDiscord />
              </motion.a>
              <motion.a 
                href="/memories"
                whileHover={{ scale: 1.2, backgroundColor: "#ff64b6", color: "white" }}
                whileTap={{ scale: 0.9 }}
              >
                <FaHeart />
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header; 