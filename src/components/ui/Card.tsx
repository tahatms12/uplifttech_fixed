import React, { useRef, memo } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hoverEffect?: boolean;
  delay?: number;
}

const Card: React.FC<CardProps> = memo(({ 
  className = '', 
  children, 
  hoverEffect = true,
  delay = 0
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    margin: "-10% 0px -10% 0px",
    once: true,
  });
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: delay * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const hoverVariants = hoverEffect ? {
    hover: {
      y: -5,
      transition: { duration: 0.2 },
      boxShadow: '0 10px 30px -10px rgba(155, 29, 255, 0.2)'
    }
  } : {};

  return (
    <motion.div
      ref={ref}
      className={`glass-card p-4 sm:p-6 ${hoverEffect ? 'hover:border-electric-violet/50 transition-all duration-300' : ''} ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover="hover"
      variants={{
        ...cardVariants,
        ...hoverVariants
      }}
    >
      {children}
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.className === nextProps.className &&
    prevProps.hoverEffect === nextProps.hoverEffect &&
    prevProps.delay === nextProps.delay
  );
});

Card.displayName = 'Card';

export default Card;