varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;

void main() {
  vUv = uv;
  vPosition = position;

  vec2 uvCopy = uv * 2.0 - 1.0;

  float d = length(uvCopy) - 0.5;
  d *= fract(uvCopy.x * 2.0) - 0.5;
  d = sin(d * 8.0 + uTime) / 8.0;
  d = 1.0 - smoothstep(0., 0.7, d);
  d = sin(uTime) * 10.0/ d - sin(uTime) * 10.0;

  vec3 newPosition = vec3(position) + d;
  
  vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
  vec4 projectedPosition = projectionMatrix * modelViewPosition;
  gl_Position = projectedPosition;
}
