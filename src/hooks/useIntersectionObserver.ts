import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '-10%',
  freezeOnceVisible = true
}: UseIntersectionObserverProps = {}) => {
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const frozen = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const shouldUpdate = !freezeOnceVisible || !frozen.current;
        
        if (shouldUpdate && entry.isIntersecting) {
          setIsVisible(true);
          if (freezeOnceVisible) {
            frozen.current = true;
          }
        } else if (!freezeOnceVisible) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, freezeOnceVisible]);

  return [elementRef, isVisible] as const;
};