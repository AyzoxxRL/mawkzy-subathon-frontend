import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBookOpen, FaCamera, FaChartLine, FaHeart, FaStar } from 'react-icons/fa';
import './HomePage.scss';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.section 
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-background">
          <motion.div 
            className="particle particle-1"
            animate={{ 
              y: ["-10%", "10%", "-10%"],
              x: ["-5%", "5%", "-5%"],
              scale: [1, 1.1, 1],
              opacity: [0.7, 0.9, 0.7]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="particle particle-2"
            animate={{ 
              y: ["5%", "-5%", "5%"],
              x: ["3%", "-3%", "3%"],
              scale: [1.1, 1, 1.1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="particle particle-3"
            animate={{ 
              y: ["-15%", "15%", "-15%"],
              x: ["5%", "-5%", "5%"],
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.span
                className="highlight-1"
                animate={{ 
                  color: ["#9146FF", "#ff64b6", "#9146FF"],
                  textShadow: [
                    "0 0 20px rgba(145, 70, 255, 0.4)",
                    "0 0 30px rgba(255, 100, 182, 0.4)",
                    "0 0 20px rgba(145, 70, 255, 0.4)"
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
                className="highlight-2"
                animate={{ 
                  color: ["#ff64b6", "#9146FF", "#ff64b6"],
                  textShadow: [
                    "0 0 20px rgba(255, 100, 182, 0.4)",
                    "0 0 30px rgba(145, 70, 255, 0.4)",
                    "0 0 20px rgba(255, 100, 182, 0.4)"
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 4
                }}
              >
                Subathon
              </motion.span>{" "}
              <span className="highlight-3">Memory Book</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Une collection de souvenirs et moments mémorables du subathon de Mawkzy,
              créée par Ayzoxx.
            </motion.p>
            
            <motion.div 
              className="hero-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="stat-item">
                <FaStar className="stat-icon" />
                <div className="stat-text">
                  <span className="stat-value">15</span>
                  <span className="stat-label">Jours de subathon</span>
                </div>
              </div>
              
              <div className="stat-item">
                <FaHeart className="stat-icon" />
                <div className="stat-text">
                  <span className="stat-value">5100</span>
                  <span className="stat-label">Subs</span>
                </div>
              </div>
              
              <div className="stat-item">
                <FaChartLine className="stat-icon" />
                <div className="stat-text">
                  <span className="stat-value">3.8K</span>
                  <span className="stat-label">Viewers max</span>
                </div>
              </div>
            </motion.div>
            
            <div className="hero-buttons">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 17,
                  duration: 0.5, 
                  delay: 0.8 
                }}
              >
                <Link to="/memories" className="btn btn-primary">
                  Voir les souvenirs
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        <div className="hero-shape">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <motion.path 
              d="M0,0 L48,8.33333 C96,16.6667 192,33.3333 288,38.3333 C384,43.3333 480,36.6667 576,33.3333 C672,30 768,30 864,33.3333 C960,36.6667 1056,43.3333 1152,40 C1248,36.6667 1344,23.3333 1392,16.6667 L1440,10 L1440,100 L1392,100 C1344,100 1248,100 1152,100 C1056,100 960,100 864,100 C768,100 672,100 576,100 C480,100 384,100 288,100 C192,100 96,100 48,100 L0,100 Z" 
              fill="var(--bg-primary)"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            Explorez le Subathon
          </motion.h2>
          
          <div className="features-grid">
            {[
              { 
                icon: <FaBookOpen />, 
                title: "Souvenirs", 
                description: "Parcourez les souvenirs et messages partagés par Ayzoxx",
                link: "/memories",
                linkText: "Voir tous les souvenirs",
                delay: 0.1,
              },
              { 
                icon: <FaCamera />, 
                title: "Galerie", 
                description: "Revivez les moments forts en images avec timestamps Twitch",
                link: "/gallery",
                linkText: "Voir la galerie",
                delay: 0.2,
              },
              { 
                icon: <FaHeart />, 
                title: "Remerciements", 
                description: "Laissez un message de remerciement à Mawkzy pour son subathon",
                link: "/remerciements",
                linkText: "Voir les remerciements",
                delay: 0.3,
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ 
                  y: -10, 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  backgroundColor: 'var(--color-feature-hover)'
                }}
              >
                <motion.div 
                  className="feature-icon"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {feature.icon}
                </motion.div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link to={feature.link} className="feature-link">{feature.linkText}</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Partagez Vos Souvenirs</h2>
            <p>Contribuez à cette collection de souvenirs en partageant vos moments préférés du subathon de Mawkzy</p>
            <Link to="/memories" className="btn btn-primary">Ajouter un souvenir</Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 