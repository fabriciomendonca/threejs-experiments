attribute vec3 color;

uniform float uTime;
uniform float uSize;

varying vec3 vColor;

void main() {
    vec3 newPosition = position;
    newPosition.y += sin(uTime * 2.0 + newPosition.x) * 3.0;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 modelViewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * modelViewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize;
    gl_PointSize *= (1.0 / - modelViewPosition.z);

    vColor = color;
}