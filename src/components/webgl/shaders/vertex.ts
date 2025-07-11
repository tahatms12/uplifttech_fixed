export const vertexShader = `
  attribute vec3 velocity;
  uniform float uTime;
  uniform float uSize;
  
  varying vec3 vPosition;
  
  void main() {
    vPosition = position;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * (1.0 / -mvPosition.z);
  }
`;