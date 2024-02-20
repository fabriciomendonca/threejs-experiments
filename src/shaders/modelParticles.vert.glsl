// attribute vec3 color;

varying vec3 vColor;
void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 modelViewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * modelViewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = 320.0;
  gl_PointSize *= (1.0 / - modelViewPosition.z);

  vColor = color;
}