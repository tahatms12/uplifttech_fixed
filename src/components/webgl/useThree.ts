import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { fragmentShader } from './shaders/fragment';
import { vertexShader } from './shaders/vertex';

interface ThreeConfig {
  particleCount: number;
  particleSize: number;
  speed: number;
  colors: {
    primary: THREE.Color;
    secondary: THREE.Color;
    background: THREE.Color;
  };
}

interface UseThreeProps {
  containerRef: React.RefObject<HTMLDivElement>;
  isWebGLAvailable: boolean;
  isReducedMotion: boolean;
  isMobile: boolean;
  config: ThreeConfig;
}

export const useThree = ({
  containerRef,
  isWebGLAvailable,
  isReducedMotion,
  isMobile,
  config
}: UseThreeProps) => {
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const particlesRef = useRef<THREE.Points>();
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!isWebGLAvailable || !containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    // Create renderer with transparency
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x0D0D0F, 0);
    rendererRef.current = renderer;

    // Create particle system
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.particleCount * 3);
    const velocities = new Float32Array(config.particleCount * 3);

    for (let i = 0; i < config.particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;

      velocities[i3] = (Math.random() - 0.5) * 0.2;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.2;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    // Create shader material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: config.particleSize * window.devicePixelRatio },
        uPrimaryColor: { value: config.colors.primary },
        uSecondaryColor: { value: config.colors.secondary }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Mount renderer
    containerRef.current.appendChild(renderer.domElement);

    // Animation loop
    let lastTime = 0;
    const animate = (time: number) => {
      const delta = (time - lastTime) * 0.001 * config.speed;
      lastTime = time;

      if (!isReducedMotion) {
        const positions = geometry.attributes.position.array as Float32Array;
        const velocities = geometry.attributes.velocity.array as Float32Array;

        for (let i = 0; i < config.particleCount; i++) {
          const i3 = i * 3;
          positions[i3] += velocities[i3] * delta;
          positions[i3 + 1] += velocities[i3 + 1] * delta;
          positions[i3 + 2] += velocities[i3 + 2] * delta;

          // Boundary check
          for (let j = 0; j < 3; j++) {
            if (Math.abs(positions[i3 + j]) > 50) {
              positions[i3 + j] *= -0.9;
              velocities[i3 + j] *= -0.9;
            }
          }
        }

        geometry.attributes.position.needsUpdate = true;
      }

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
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [isWebGLAvailable, isReducedMotion, isMobile, config]);
};