// uniform float uPointSie;

void main() {
  vec3 newPosition = position;
  vec3 normalizedPosition = normalize(newPosition);
  float sizeMultiplier = (normalizedPosition.y) * 3.0;

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 modelViewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * modelViewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = 32.0 * sizeMultiplier;
}