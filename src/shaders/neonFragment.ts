export const neonFragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec3 uPrimaryColor;
  uniform vec3 uSecondaryColor;
  uniform vec3 uBackgroundColor;
  
  varying vec2 vUv;

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Create neon glow effect
    float glow = smoothstep(0.4, 0.6, luminance);
    float pulse = 0.5 + 0.5 * sin(uTime * 2.0);
    
    // Mix colors based on luminance and glow
    vec3 color = mix(
      mix(uBackgroundColor, uSecondaryColor, luminance),
      uPrimaryColor,
      glow * (0.8 + 0.2 * pulse)
    );
    
    // Preserve original image details
    vec3 final = mix(texColor.rgb, color, 0.6);
    
    // Add subtle bloom
    float bloom = smoothstep(0.7, 0.9, luminance) * 0.5;
    final += bloom * uPrimaryColor;
    
    gl_FragColor = vec4(final, texColor.a);
  }
`;