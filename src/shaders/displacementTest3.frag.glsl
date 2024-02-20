varying vec2 vUv;
varying vec3 vFinalPattern;

uniform float uTime;

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  vec3 pattern = vFinalPattern;
  vec3 col = 0.5 - vec3(0.45, 5.0, 3.0) * pattern;
  col = 0.4 / col;

  gl_FragColor = vec4(col,1.0);
}
