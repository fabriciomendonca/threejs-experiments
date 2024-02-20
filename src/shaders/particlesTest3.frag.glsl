
varying vec3 vColor;

uniform float uTime;

void main() {
    vec2 newUv = gl_PointCoord * 2.0 - 1.0;

    float circle = distance(newUv, vec2(0.0)) - 0.25;
    circle = 1.0 - circle;
    // circle = pow(circle, 10.0);
    vec3 color = vColor * circle;
    
    gl_FragColor = vec4(color, 1.0 - circle);
}