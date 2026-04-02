attribute vec3 color;
attribute vec4 colorWithAlpha;

uniform float uTime;

varying vec3 vColor;
varying vec4 vColorWithAlpha;

void main() {
    vec3 newPosition = position;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 modelViewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * modelViewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = 256.0;
    gl_PointSize *= (1.0 / - modelViewPosition.z);

    vColor = color;
    vColorWithAlpha = colorWithAlpha;
}