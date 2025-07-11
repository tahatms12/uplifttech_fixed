import React from 'react';
import { motion } from 'framer-motion';

interface CircuitLinesProps {
  className?: string;
  variant?: 'corner' | 'divider';
  color?: 'primary' | 'accent';
}

const CircuitLines: React.FC<CircuitLinesProps> = ({
  className = '',
  variant = 'corner',
  color = 'primary'
}) => {
  const baseClasses = 'absolute pointer-events-none';
  const colorClasses = {
    primary: 'text-deep-purple/30',
    accent: 'text-electric-violet/50'
  };

  return (
    <motion.div
      className={`${baseClasses} ${colorClasses[color]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={variant === 'corner' ? 'w-16 h-16' : 'w-full h-16'}
      >
        {variant === 'corner' ? (
          <path
            d="M2 2v20h4v-16h16V2H2zm40 0v4h16v16h4V2H42zM6 42H2v20h20v-4H6V42zm56 0h-4v16H42v4h20V42z"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        ) : (
          <path
            d="M0 32h24m8 0h24M32 8v16m0 16v16"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        )}
      </svg>
    </motion.div>
  );
};

export default CircuitLines;