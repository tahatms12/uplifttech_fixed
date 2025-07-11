import { useReducedMotion } from 'framer-motion';

interface AnimationConfig {
  duration: number;
  ease: [number, number, number, number];
  exit?: {
    duration: number;
    ease: [number, number, number, number];
  };
}

export const useAnimationConfig = (isExit = false): AnimationConfig => {
  const shouldReduceMotion = useReducedMotion();
  
  const baseConfig: AnimationConfig = {
    duration: shouldReduceMotion ? 0.01 : 0.3,
    ease: [0.25, 0.1, 0.25, 1], // Optimized cubic bezier
    exit: {
      duration: shouldReduceMotion ? 0.01 : 0.2,
      ease: [0.4, 0, 1, 1] // Quick exit
    }
  };

  return isExit ? { ...baseConfig, ...baseConfig.exit } : baseConfig;
};

export const fadeUpVariants = (delay = 0) => {
  const shouldReduceMotion = useReducedMotion();
  
  return {
    hidden: { 
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.3,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };
};

export const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};