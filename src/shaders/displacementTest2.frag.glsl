varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;

float blackBand(float uvAxis, float size, float direction) {
  return smoothstep(size - 0.01, size - 0.5, uvAxis);
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;

  float d = blackBand(uv.x, 0., 0.0);
  float d2 = blackBand(sin(uv.y + uTime), 1.2, 0.0);
  float d3 = blackBand(- uv.y, 0., 1.0);
  float d4 = blackBand(- abs(sin(uv.x + uTime)), 0.2, 1.0);
  d = d * d2 * d3 * d4;
  vec3 col1 = vec3(abs(sin(uTime)), 0.0, 0.0) * d;
  d = blackBand(abs(sin(uv.x + uTime)), 0.4, 0.0);
  d2 = blackBand(uv.y, 0.7, 0.0);
  d3 = blackBand(- uv.y, 0.1, 1.0);
  d4 = blackBand(- uv.x, 1.2, 1.0);
  d = 1.0 / d * d2 * d3 * d4;
  vec3 col2 = vec3(0.0, abs(sin(uTime)), 0.0) * d;
  d = blackBand(abs(sin(uv.x + uTime)), 0.4, 0.0);
  d2 = blackBand(uv.y, 0.0, 0.0);
  d3 = blackBand(- abs(sin(uv.y + uTime)), 1.0, 1.0);
  d4 = blackBand(- uv.x, 0.5, 1.0);
  d = 1.0 / d * d2 * d3 * d4;
  vec3 col3 = vec3(0.0, 0.0, abs(sin(uTime))) * d;

  gl_FragColor = vec4(col2 + col1 + col3,1.0);
}
