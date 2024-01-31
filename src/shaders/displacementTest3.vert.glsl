varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
  vUv = uv;
  vPosition = position;

  vec2 uvCopy = uv * 2.0 - 1.0;

  float pattern = noise(uvCopy);
  uvCopy += pattern;
  // float d = length(uvCopy) - 0.5;
  // d *= fract(uvCopy.x * 2.0) - 0.5;
  // d = sin(d * 8.0 + uTime) / 8.0;
  // d = 1.0 - smoothstep(0., 0.7, d);
  // d = sin(uTime) * 10.0/ d - sin(uTime) * 10.0;

  float d = mod(pattern * 4.0, 1.0);
  d = 1.0 - smoothstep(0.1, 0.8, d);
  // d = 0.6 / d;
  
  vec3 newPosition = position + normal * vec3(d + sin(d * 2.0 + uTime), d + abs(sin(d / 2.0 + uTime)), d + abs(cos(d  + uTime)));
  
  vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
  vec4 projectedPosition = projectionMatrix * modelViewPosition;
  gl_Position = projectedPosition;
}
