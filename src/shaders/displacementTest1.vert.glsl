varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;

void main() {
  vUv = uv;
  vPosition = position;

  vec2 uvCopy = vUv * 2.0 - 1.0;
  vec2 uv0 = uvCopy;
  uvCopy = fract(uvCopy * 1.9) - 0.5;

  vec3 col = vec3(2.0, 1.0, 4.0);
  float d = length(uvCopy);
  d = sin(d * 4.0 + uTime) / 4.0;
  d = abs(d) * clamp(abs(sin(uTime)), 0.5, 0.9);
  d = smoothstep(0.25, 0.01, d);

  vec4 modelViewPosition = modelViewMatrix * vec4(position * (d + 1.0), 1.0);
  vec4 projectedPosition = projectionMatrix * modelViewPosition;
  gl_Position = projectedPosition;
}
