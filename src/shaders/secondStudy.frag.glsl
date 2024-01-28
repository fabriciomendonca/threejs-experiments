varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  vec2 uv0 = uv;
  uv = fract(uv * 1.9) - 0.5;

  vec3 col = vec3(2.0, 1.0, 4.0);
  float d = length(uv);
  d = sin(d * 8.0 + uTime) / 8.0;
  d = abs(d);
  d = 1.0 - smoothstep(0.25, 0.01, d);
  d = 0.2 / d;
  
  float last = smoothstep(0.01, 0.5, length(uv0 * abs(sin(uTime)) + 0.5)) * 0.65;
  col *= d * last;

  gl_FragColor = vec4(col,1.0);
}
