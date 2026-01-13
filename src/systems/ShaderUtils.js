/**
 * ShaderUtils - WebGL shader compilation and management utilities
 * 
 * Provides helper functions for compiling shaders, creating shader programs,
 * and setting up WebGL rendering pipelines for post-processing effects.
 */

/**
 * Create and compile a WebGL shader
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {number} type - Shader type (gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
 * @param {string} source - GLSL shader source code
 * @returns {WebGLShader|null}
 */
export function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) {
    console.error('Failed to create shader');
    return null;
  }
  
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    console.error('Shader compilation error:', info);
    gl.deleteShader(shader);
    return null;
  }
  
  return shader;
}

/**
 * Create a shader program from vertex and fragment shader sources
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {string} vertexSource - Vertex shader GLSL source
 * @param {string} fragmentSource - Fragment shader GLSL source
 * @returns {WebGLProgram|null}
 */
export function createShaderProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  
  if (!vertexShader || !fragmentShader) {
    return null;
  }
  
  const program = gl.createProgram();
  if (!program) {
    console.error('Failed to create shader program');
    return null;
  }
  
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    console.error('Shader program linking error:', info);
    gl.deleteProgram(program);
    return null;
  }
  
  // Clean up shaders (they're now part of the program)
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  
  return program;
}

/**
 * Standard vertex shader for fullscreen quad rendering
 * Maps texture coordinates 0-1 to clip space -1 to 1
 */
export const FULLSCREEN_VERTEX_SHADER = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}
`;

/**
 * Setup a fullscreen quad for rendering
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {WebGLProgram} program - Shader program
 * @returns {Object} Buffer and attribute locations
 */
export function setupFullscreenQuad(gl, program) {
  // Create vertex buffer for fullscreen quad
  // Two triangles covering the entire clip space (-1 to 1)
  const positions = new Float32Array([
    -1, -1,  0, 0,  // bottom-left (position, texcoord)
     1, -1,  1, 0,  // bottom-right
    -1,  1,  0, 1,  // top-left
     1,  1,  1, 1,  // top-right
  ]);
  
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  
  // Get attribute locations
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
  
  return {
    buffer,
    positionLocation,
    texCoordLocation,
  };
}

/**
 * Create a texture from a canvas
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @returns {WebGLTexture|null}
 */
export function createTextureFromCanvas(gl, canvas) {
  const texture = gl.createTexture();
  if (!texture) {
    console.error('Failed to create texture');
    return null;
  }
  
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // Upload canvas content to texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  
  // Set texture parameters (no mipmaps needed for screen-space effects)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  
  return texture;
}

/**
 * Update texture with new canvas content
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {WebGLTexture} texture - Texture to update
 * @param {HTMLCanvasElement} canvas - Source canvas
 */
export function updateTextureFromCanvas(gl, texture, canvas) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
}

/**
 * Render fullscreen quad with shader
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {WebGLProgram} program - Shader program
 * @param {Object} quad - Quad data from setupFullscreenQuad
 */
export function renderFullscreenQuad(gl, program, quad) {
  gl.useProgram(program);
  
  // Bind vertex buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, quad.buffer);
  
  // Setup position attribute
  gl.enableVertexAttribArray(quad.positionLocation);
  gl.vertexAttribPointer(quad.positionLocation, 2, gl.FLOAT, false, 16, 0);
  
  // Setup texcoord attribute
  gl.enableVertexAttribArray(quad.texCoordLocation);
  gl.vertexAttribPointer(quad.texCoordLocation, 2, gl.FLOAT, false, 16, 8);
  
  // Draw two triangles (4 vertices as triangle strip)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
