import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useThree } from './useThree';

interface WebGLBackgroundProps {
  className?: string;
}

const WebGLBackground: React.FC<WebGLBackgroundProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWebGLAvailable, setIsWebGLAvailable] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIsWebGLAvailable(!!gl);
    } catch (e) {
      setIsWebGLAvailable(false);
    }

    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    // Check if mobile device
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useThree({
    containerRef,
    isWebGLAvailable,
    isReducedMotion,
    isMobile,
    config: {
      particleCount: isMobile ? 50 : 100,
      particleSize: isMobile ? 3 : 5,
      speed: isReducedMotion ? 0.1 : 0.3,
      colors: {
        primary: new THREE.Color('#9B1DFF'),
        secondary: new THREE.Color('#280059'),
        background: new THREE.Color('#0D0D0F')
      }
    }
  });

  if (!isWebGLAvailable) {
    return (
      <div 
        className={`absolute inset-0 bg-gradient-radial from-deep-purple/20 to-rich-black ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
};

export default WebGLBackground;