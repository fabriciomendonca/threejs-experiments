varying vec3 vColor;

uniform float uTime;

void main() {
    vec2 newUv = gl_PointCoord * 2.0 - 1.0;

    float circle = distance(newUv, vec2(0.0)) - 0.25;
    circle = abs(circle);
    circle = 1.0 - circle;
    circle = pow(circle, 10.0);

    vec3 color = 0.2 / vec3(0.15 * abs(sin(uTime / 10.0)), 0.67 * abs(sin(uTime / 10.0)), 0.12 * abs(sin(uTime / 10.0)));
    
    gl_FragColor = vec4(mix(vec3(0.0), vColor * color, circle), 1.0);
}