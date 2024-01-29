varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;

void main() {
  vUv = uv;
  vPosition = position;

  float newPosX = cos(position.y / 4.0 + uTime);
  float newPosY = sin(position.x / 4.0 + uTime);
  float newPosZ = sin((position.y + position.x) + uTime);

  vec3 newPosition = vec3(position.x + newPosX,position.y + newPosY, position.z + newPosZ);

  vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
  vec4 projectedPosition = projectionMatrix * modelViewPosition;
  gl_Position = projectedPosition;
}
