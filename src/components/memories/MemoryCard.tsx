import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaHeart, FaQuoteLeft, FaQuoteRight, FaLink } from 'react-icons/fa';
import { Memory } from '../../types';
import './MemoryCard.scss';

interface MemoryCardProps {
  memory: Memory;
  onClick?: () => void;
  showClipLink?: boolean;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onClick, showClipLink = false }) => {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // 3D card effect
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for the card tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smoother animation with springs
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), {
    stiffness: 100,
    damping: 30
  });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), {
    stiffness: 100,
    damping: 30
  });

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Get the cursor position relative to the card center
    const xValue = e.clientX - rect.left - width / 2;
    const yValue = e.clientY - rect.top - height / 2;
    
    // Update motion values
    x.set(xValue);
    y.set(yValue);
  };
  
  // Reset the card position when mouse leaves
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div 
      ref={cardRef}
      className={`memory-card ${isHovered ? 'hovered' : ''}`}
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        z: isHovered ? 20 : 0
      }}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="memory-card-content">
        <div className="quote-marks left">
          <FaQuoteLeft />
        </div>
        
        <p className="memory-message">{memory.message}</p>
        
        <div className="quote-marks right">
          <FaQuoteRight />
        </div>
        
        <div className="memory-meta">
          <div className="memory-info">
            <span className="memory-author">{memory.author}</span>
            <span className="memory-date">{formatDate(memory.timestamp)}</span>
            
            {showClipLink && memory.clipUrl && (
              <a 
                href={memory.clipUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="clip-link"
                onClick={(e) => e.stopPropagation()}
              >
                <FaLink /> Voir le clip original
              </a>
            )}
          </div>
          
          <motion.div 
            className="memory-likes"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <FaHeart className="heart-icon" />
            <span>{memory.likes}</span>
          </motion.div>
        </div>
      </div>
      
      {/* Glare effect */}
      <div className="card-glare" style={{
        opacity: isHovered ? 0.1 : 0,
        transform: `
          translateX(${useTransform(x, [-100, 100], [-50, 50]).get()}px) 
          translateY(${useTransform(y, [-100, 100], [-50, 50]).get()}px)
        `
      }} />
    </motion.div>
  );
};

export default MemoryCard; 