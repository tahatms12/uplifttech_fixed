import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { useFadeUpVariants } from "../../hooks/useAnimationConfig";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  className = "",
  delay = 0,
}) => {
  const [ref, isVisible] = useIntersectionObserver();
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const variants = useFadeUpVariants(delay);

  // Prevent re-hiding once the element has been visible at least once
  useEffect(() => {
    if (isVisible && !hasBeenVisible) {
      setHasBeenVisible(true);
    }
  }, [isVisible, hasBeenVisible]);

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      initial="hidden"
      animate={hasBeenVisible ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default AnimateOnScroll;
