/**
 * Shaders - WebGL fragment shader definitions for visual styles
 * 
 * Each shader takes a rendered scene texture and applies post-processing effects.
 * All shaders use the same vertex shader (fullscreen quad) from ShaderUtils.
 */

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
