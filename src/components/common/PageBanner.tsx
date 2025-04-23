import React from 'react';
import { motion } from 'framer-motion';
import './PageBanner.scss';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  gradient?: string;
  pattern?: string;
}

const PageBanner: React.FC<PageBannerProps> = ({ 
  title, 
  subtitle, 
  backgroundImage,
  gradient = "linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)",
  pattern = "/images/memory-pattern.png" 
}) => {
  return (
    <section 
      className="page-banner"
      style={{ 
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        background: !backgroundImage ? gradient : undefined
      }}
    >
      <div className="banner-overlay" style={{ backgroundImage: `url(${pattern})` }}></div>
      
      <div className="container">
        <motion.div 
          className="banner-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PageBanner; 