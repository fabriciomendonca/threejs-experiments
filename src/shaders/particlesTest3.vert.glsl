uniform float uTime;
uniform float uSize;

varying vec3 vColor;

void main() {
    vec3 newPosition = position;
    // newPosition.z += sin(uTime) * 20.0 + 20.0;
    newPosition.x += 10.0 * cos(uTime / 20.0);
    newPosition.y += 20.0 * sin(uTime / 20.0);
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 modelViewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * modelViewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize;
    gl_PointSize *= (1.0 / - modelViewPosition.z);

    vColor = color;
}