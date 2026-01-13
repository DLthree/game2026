/**
 * Shaders - WebGL fragment shader definitions for visual styles
 * 
 * Each shader takes a rendered scene texture and applies post-processing effects.
 * All shaders use the same vertex shader (fullscreen quad) from ShaderUtils.
 */

/**
 * GEOMETRY_DASH_BLOOM - Geometry Dash inspired style with strong bloom effect
 * 
 * Creates a visual style similar to Geometry Dash:
 * - Strong bloom/glow on bright objects
 * - High contrast with dark background
 * - Vibrant, saturated colors
 * - Crisp edges with glowing halos
 */
export const GEOMETRY_DASH_BLOOM_SHADER = `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 v_texCoord;

void main() {
  vec2 texelSize = 1.0 / u_resolution;
  vec4 color = texture2D(u_texture, v_texCoord);
  
  // Extract brightness for bloom
  float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  vec3 bloomColor = vec3(0.0);
  
  // Strong bloom for Geometry Dash look with optimized sampling
  // Using separable blur concept but in single pass with fewer samples
  float blurRadius = 12.0;
  
  // Only bloom bright pixels (lower threshold for more glow)
  if (brightness > 0.15) {
    // Optimized radial sampling pattern (12 samples instead of 25)
    // Sample at cardinal and diagonal directions at two distances
    float sampleCount = 0.0;
    
    // Inner ring (4 samples)
    vec2 offsets[4];
    offsets[0] = vec2(1.0, 0.0);
    offsets[1] = vec2(0.0, 1.0);
    offsets[2] = vec2(-1.0, 0.0);
    offsets[3] = vec2(0.0, -1.0);
    
    for (int i = 0; i < 4; i++) {
      vec2 offset = offsets[i] * blurRadius * texelSize;
      bloomColor += texture2D(u_texture, v_texCoord + offset).rgb;
      sampleCount += 1.0;
    }
    
    // Outer ring (8 samples at diagonals and extended cardinals)
    vec2 offsets2[8];
    offsets2[0] = vec2(1.5, 1.5);
    offsets2[1] = vec2(-1.5, 1.5);
    offsets2[2] = vec2(1.5, -1.5);
    offsets2[3] = vec2(-1.5, -1.5);
    offsets2[4] = vec2(2.0, 0.0);
    offsets2[5] = vec2(0.0, 2.0);
    offsets2[6] = vec2(-2.0, 0.0);
    offsets2[7] = vec2(0.0, -2.0);
    
    for (int i = 0; i < 8; i++) {
      vec2 offset = offsets2[i] * blurRadius * texelSize;
      bloomColor += texture2D(u_texture, v_texCoord + offset).rgb * 0.7;
      sampleCount += 0.7;
    }
    
    bloomColor /= sampleCount;
  }
  
  // Boost saturation for Geometry Dash look
  vec3 finalColor = color.rgb;
  float lum = dot(finalColor, vec3(0.299, 0.587, 0.114));
  finalColor = mix(vec3(lum), finalColor, 1.6); // Increase saturation strongly
  
  // Add bloom with very strong intensity (Geometry Dash has extreme bloom)
  finalColor += bloomColor * 5.0;
  
  // Increase contrast significantly
  finalColor = (finalColor - 0.5) * 1.6 + 0.5;
  
  // Slight brightness boost for vibrant look
  finalColor *= 1.15;
  
  // Clamp and output
  gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), color.a);
}
`;

/**
 * CLEAN_GLTEST - Simple passthrough shader to test WebGL functionality
 * 
 * This is a minimal shader that simply displays the input texture without modification.
 * Used to verify that the WebGL pipeline is working correctly.
 */
export const CLEAN_GLTEST_SHADER = `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 v_texCoord;

void main() {
  // Simple passthrough - just sample and display the texture
  vec4 color = texture2D(u_texture, v_texCoord);
  gl_FragColor = color;
}
`;

/**
 * CLEAN_GLSTYLE - Stylistic shader with color grading and subtle effects
 * 
 * This shader applies multiple stylistic effects:
 * - Enhanced contrast and saturation
 * - Slight color grading with cool/warm tones
 * - Subtle vignette effect
 * - Sharpening filter for crisp visuals
 */
export const CLEAN_GLSTYLE_SHADER = `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 v_texCoord;

// Convert RGB to HSV
vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// Convert HSV to RGB
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec2 uv = v_texCoord;
  vec2 texelSize = 1.0 / u_resolution;
  
  // Sample center pixel
  vec4 center = texture2D(u_texture, uv);
  
  // Sharpening kernel (5-tap)
  vec4 left = texture2D(u_texture, uv + vec2(-texelSize.x, 0.0));
  vec4 right = texture2D(u_texture, uv + vec2(texelSize.x, 0.0));
  vec4 top = texture2D(u_texture, uv + vec2(0.0, -texelSize.y));
  vec4 bottom = texture2D(u_texture, uv + vec2(0.0, texelSize.y));
  
  // Apply sharpening
  float sharpenAmount = 0.3;
  vec4 sharpened = center * (1.0 + 4.0 * sharpenAmount) - (left + right + top + bottom) * sharpenAmount;
  vec3 color = sharpened.rgb;
  
  // Convert to HSV for color manipulation
  vec3 hsv = rgb2hsv(color);
  
  // Increase saturation
  hsv.y *= 1.3;
  hsv.y = clamp(hsv.y, 0.0, 1.0);
  
  // Increase brightness slightly
  hsv.z *= 1.1;
  
  // Convert back to RGB
  color = hsv2rgb(hsv);
  
  // Contrast adjustment
  float contrast = 1.2;
  color = ((color - 0.5) * contrast) + 0.5;
  
  // Color grading - add slight cool tint to shadows, warm tint to highlights
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  vec3 coolTint = vec3(0.9, 0.95, 1.0);   // Slight blue tint
  vec3 warmTint = vec3(1.0, 0.98, 0.95);  // Slight orange tint
  vec3 tint = mix(coolTint, warmTint, luminance);
  color *= tint;
  
  // Subtle vignette
  vec2 position = uv - 0.5;
  float vignette = 1.0 - dot(position, position) * 0.5;
  vignette = pow(vignette, 0.8);
  color *= vignette;
  
  // Clamp to valid range
  color = clamp(color, 0.0, 1.0);
  
  gl_FragColor = vec4(color, 1.0);
}
`;

/**
 * PSYCHEDELIC_BLAST - Highly visible shader with dramatic effects
 * 
 * This shader combines multiple striking visual effects to create an unmistakable style:
 * - Animated rainbow color cycling
 * - Chromatic aberration (RGB channel separation)
 * - Wave distortion
 * - Animated scanlines
 * - Radial color shifting
 * - Bloom/glow effect
 * - Dynamic noise patterns
 */
export const PSYCHEDELIC_BLAST_SHADER = `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 v_texCoord;

// Random function for noise
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 2D rotation matrix
mat2 rotate2D(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main() {
  vec2 uv = v_texCoord;
  vec2 center = vec2(0.5, 0.5);
  vec2 toCenter = uv - center;
  float dist = length(toCenter);
  float angle = atan(toCenter.y, toCenter.x);
  
  // WAVE DISTORTION - Creates wavy motion
  float waveFreq = 10.0;
  float waveAmp = 0.02;
  vec2 waveOffset = vec2(
    sin(uv.y * waveFreq + u_time * 2.0) * waveAmp,
    cos(uv.x * waveFreq + u_time * 2.0) * waveAmp
  );
  
  // SPIRAL DISTORTION - Rotating effect from center
  float spiralStrength = 0.3;
  float spiralAngle = dist * 3.14159 * spiralStrength * sin(u_time * 0.5);
  vec2 spiralUV = center + rotate2D(spiralAngle) * toCenter;
  
  // Combine distortions
  vec2 distortedUV = spiralUV + waveOffset;
  
  // CHROMATIC ABERRATION - Separate RGB channels
  float aberrationStrength = 0.01 + 0.005 * sin(u_time * 2.0);
  vec2 aberrationOffset = toCenter * aberrationStrength;
  
  float r = texture2D(u_texture, distortedUV + aberrationOffset).r;
  float g = texture2D(u_texture, distortedUV).g;
  float b = texture2D(u_texture, distortedUV - aberrationOffset).b;
  vec3 color = vec3(r, g, b);
  
  // RAINBOW COLOR CYCLING - Shift hue based on position and time
  float hueShift = u_time * 0.5 + dist * 2.0 + angle * 0.5;
  float hue = fract(hueShift);
  
  // Convert hue to RGB (simple HSV to RGB for hue cycling)
  vec3 rainbow;
  float h = hue * 6.0;
  float x = 1.0 - abs(mod(h, 2.0) - 1.0);
  
  if (h < 1.0) rainbow = vec3(1.0, x, 0.0);
  else if (h < 2.0) rainbow = vec3(x, 1.0, 0.0);
  else if (h < 3.0) rainbow = vec3(0.0, 1.0, x);
  else if (h < 4.0) rainbow = vec3(0.0, x, 1.0);
  else if (h < 5.0) rainbow = vec3(x, 0.0, 1.0);
  else rainbow = vec3(1.0, 0.0, x);
  
  // Blend original color with rainbow based on luminance
  float lum = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(color * 0.5, rainbow, 0.4 + 0.2 * sin(u_time * 3.0));
  color *= 1.0 + lum * 0.5;
  
  // ANIMATED SCANLINES - Moving horizontal lines
  float scanlineSpeed = 2.0;
  float scanlineFreq = 100.0;
  float scanline = sin((uv.y * scanlineFreq + u_time * scanlineSpeed) * 3.14159);
  scanline = scanline * 0.5 + 0.5;
  scanline = pow(scanline, 10.0) * 0.3;
  color += vec3(scanline);
  
  // RADIAL COLOR PULSE - Pulsing rings from center
  float pulseFreq = 5.0;
  float pulseSpeed = 2.0;
  float pulse = sin(dist * pulseFreq - u_time * pulseSpeed);
  pulse = pulse * 0.5 + 0.5;
  color += pulse * 0.15;
  
  // BLOOM/GLOW - Brighten bright areas
  float brightness = dot(color, vec3(1.0));
  if (brightness > 0.7) {
    color += (brightness - 0.7) * 2.0;
  }
  
  // DYNAMIC NOISE - Animated grain
  float noise = random(uv * 100.0 + vec2(u_time * 10.0, -u_time * 8.0));
  noise = (noise - 0.5) * 0.15;
  color += vec3(noise);
  
  // VIGNETTE - Darken edges with rainbow tint
  float vignette = 1.0 - dist * 0.8;
  vignette = smoothstep(0.3, 1.0, vignette);
  color *= vignette;
  
  // CONTRAST and SATURATION BOOST
  color = (color - 0.5) * 1.5 + 0.5;
  
  // Clamp to valid range
  color = clamp(color, 0.0, 1.0);
  
  gl_FragColor = vec4(color, 1.0);
}
`;
