import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
}

const MotionSection: React.FC<MotionSectionProps> = ({ children, className = '' }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.35 }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default MotionSection;
