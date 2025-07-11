import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { neonVertexShader } from '../shaders/neonVertex';
import { neonFragmentShader } from '../shaders/neonFragment';

interface UseNeonEffectProps {
  imageRef: React.RefObject<HTMLImageElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  enabled: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export const useNeonEffect = ({
  imageRef,
  canvasRef,
  enabled,
  colors
}: UseNeonEffectProps) => {
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!enabled || !imageRef.current || !canvasRef.current) return;

    // Create WebGL renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;

    // Set up scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Create texture from image
    const texture = new THREE.Texture(imageRef.current);
    texture.needsUpdate = true;

    // Create shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
        uPrimaryColor: { value: new THREE.Color(colors.primary) },
        uSecondaryColor: { value: new THREE.Color(colors.secondary) },
        uBackgroundColor: { value: new THREE.Color(colors.background) }
      },
      vertexShader: neonVertexShader,
      fragmentShader: neonFragmentShader,
      transparent: true
    });

    // Create plane geometry
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Handle resize
    const handleResize = () => {
      if (!imageRef.current || !canvasRef.current) return;
      
      const { width, height } = imageRef.current;
      renderer.setSize(width, height, false);
      
      const imageAspect = width / height;
      const scale = imageAspect > 1 
        ? [1, 1/imageAspect] 
        : [imageAspect, 1];
      mesh.scale.set(scale[0], scale[1], 1);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Animation loop
    const animate = (time: number) => {
      material.uniforms.uTime.value = time * 0.001;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [enabled, colors]);
};