import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface GridOverlayProps {
  className?: string;
  variant?: 'fine' | 'bracket' | 'diagonal';
}

const GridOverlay: React.FC<GridOverlayProps> = ({
  className = '',
  variant = 'fine'
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
    >
      {variant === 'fine' && (
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(155 29 255 / 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(155 29 255 / 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '10px 10px'
          }}
        />
      )}
      
      {variant === 'bracket' && (
        <div className="absolute inset-0 border border-electric-violet/20">
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-electric-violet/20" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-electric-violet/20" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-electric-violet/20" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-electric-violet/20" />
        </div>
      )}
      
      {variant === 'diagonal' && (
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              rgb(155 29 255 / 0.2),
              rgb(155 29 255 / 0.2) 1px,
              transparent 1px,
              transparent 10px
            )`
          }}
        />
      )}
    </motion.div>
  );
};

export default GridOverlay;