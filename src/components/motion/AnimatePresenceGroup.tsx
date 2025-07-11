import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationConfig } from '../../hooks/useAnimationConfig';

interface AnimatePresenceGroupProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'sync' | 'popLayout' | 'wait';
}

const AnimatePresenceGroup: React.FC<AnimatePresenceGroupProps> = ({
  children,
  className = '',
  mode = 'wait'
}) => {
  const config = useAnimationConfig();
  const exitConfig = useAnimationConfig(true);

  return (
    <AnimatePresence mode={mode}>
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: {
            duration: config.duration,
            ease: config.ease
          }
        }}
        exit={{ 
          opacity: 0, 
          y: -20,
          transition: {
            duration: exitConfig.duration,
            ease: exitConfig.ease
          }
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatePresenceGroup;