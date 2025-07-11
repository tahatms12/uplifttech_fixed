export const fragmentShader = `
  uniform vec3 uPrimaryColor;
  uniform vec3 uSecondaryColor;
  uniform float uTime;
  
  varying vec3 vPosition;
  
  void main() {
    float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
    if (distanceFromCenter > 0.5) discard;
    
    float alpha = 0.5 * (1.0 - distanceFromCenter * 2.0);
    alpha *= 0.5 + 0.5 * sin(uTime + vPosition.x * 0.1 + vPosition.y * 0.1);
    
    vec3 color = mix(uSecondaryColor, uPrimaryColor, alpha);
    gl_FragColor = vec4(color, alpha);
  }
`;