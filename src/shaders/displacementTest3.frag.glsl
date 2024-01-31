varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;

// cosine based palette, 4 vec3 params
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

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
  vec2 uv = vUv * 2.0 - 1.0;
  vec2 uv0 = uv;
  vec3 finalColor = vec3(0.0);
  
  // uv = fract(uv * 1.2) - 0.5;
  // float d = length(uv) - 0.5;
  // d = abs(sin(d * 4.0 + uTime) / 4.0);
  // d = smoothstep(0., 0.1, d);
  // d *= fract(uv.x * 0.7);
  // d = 0.1 / d;

  uv.y += uTime / 5.0;
  float pattern = smoothstep(0.1, 0.5, noise(uv * 5.0));
  uv += pattern;
  float d = mod(uv.y * 4.0, 1.0);
  d = 1.0 - smoothstep(0.1, 0.8, d);
  d = 0.6 / d;
  vec3 col = 0.1 / vec3(0.45, 0.17, 0.2) * d;

  gl_FragColor = vec4(col,1.0);
}
