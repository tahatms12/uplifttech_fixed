import { useEffect, useRef } from 'react';

interface UseAnimationFrameProps {
  callback: (deltaTime: number) => void;
  isActive?: boolean;
  fps?: number;
}

export const useAnimationFrame = ({
  callback,
  isActive = true,
  fps = 60
}: UseAnimationFrameProps) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const frameIntervalRef = useRef(1000 / fps);

  useEffect(() => {
    if (!isActive) return;

    const animate = (time: number) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time;
      }

      const deltaTime = time - previousTimeRef.current;
      
      if (deltaTime >= frameIntervalRef.current) {
        callback(deltaTime);
        previousTimeRef.current = time;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback, isActive, fps]);
};