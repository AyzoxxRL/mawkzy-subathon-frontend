import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTwitch, FaDiscord, FaTwitter, FaHeart, FaInstagram } from 'react-icons/fa';
import './Footer.scss';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const navLinks = [
    { title: 'Accueil', path: '/' },
    { title: 'Souvenirs', path: '/memories' },
    { title: 'Remerciements', path: '/remerciements' },
  ];
  
  // Variantes d'animation pour le hover sur les liens
  const linkHoverVariants = {
    initial: { x: 0 },
    hover: { x: 5, transition: { type: 'spring', stiffness: 300 } }
  };
  
  // Animation pour l'icône de coeur
  const heartVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  return (
    <footer className="footer">
      <div className="footer-waves">
        <svg 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <motion.path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="shape-fill"
            initial={{ y: 10, opacity: 0.8 }}
            animate={{ 
              y: [10, 0, 10],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut'
            }}
          />
        </svg>
      </div>
      
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Mawkzy Subathon Memory Book
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Un projet créé par Ayzoxx pour commémorer les moments inoubliables du subathon de Mawkzy.
              </motion.p>
              <div className="footer-social">
                {[
                  { icon: <FaTwitch />, url: 'https://www.twitch.tv/mawkzy_', delay: 0.2 },
                  { icon: <FaTwitter />, url: 'https://x.com/mawkzy1', delay: 0.3 },
                  { icon: <FaDiscord />, url: 'https://discord.gg/wkcRDUNumc', delay: 0.4 },
                  { icon: <FaInstagram />, url: 'https://www.instagram.com/mawkzyrl/', delay: 0.5 }
                ].map((social, index) => (
                  <motion.a 
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: social.delay }}
                    whileHover={{ 
                      y: -5,
                      rotate: 10,
                      transition: { type: 'spring', stiffness: 500 }
                    }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div className="footer-links">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Liens rapides
              </motion.h3>
              <ul>
                {navLinks.map((link, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    variants={linkHoverVariants}
                    whileHover="hover"
                  >
                    <Link to={link.path}>{link.title}</Link>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="footer-newsletter">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Restez informé
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Inscrivez-vous pour être informé des dernières mises à jour et nouveaux souvenirs ajoutés.
              </motion.p>
              <div className="newsletter-form">
                <input type="email" placeholder="Votre email" />
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  S'inscrire
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            &copy; {currentYear} Mawkzy Memory Book. Fait avec 
            <motion.span 
              className="heart-icon"
              variants={heartVariants}
              initial="initial"
              animate="animate"
            >
              <FaHeart />
            </motion.span> 
            par Ayzoxx.
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 