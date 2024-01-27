varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;

// cosine based palette, 4 vec3 params
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
  vec2 uv = vUv - 0.5;
  // uv *= 2.0;
  // uv = fract(uv * 1.2) - 0.5;
  // float circle = 1.0 - length(uv) - 0.5;
  // float stripes = sin(circle * 20.0 + uTime * 4.0);
  // float ring = smoothstep(0.0, 0.1, stripes);
  // ring = abs(ring);
  // float neon = 0.01 / ring;

  // vec3 color = vec3(1.0, 3.0, 0.0) * neon;
  vec2 uv0 = uv;
  vec3 finalColor = vec3(0.0);
  
  for(float i = 0.0; i < 2.0; i++){
    uv = fract(uv * 1.2) - 0.5;

    float distance = clamp(length(uv) * exp(length(uv0)), 0.0, 1.0);
    vec3 color = palette(
      length(uv0) + uTime * 1.0 + i * 2.0,
      vec3(1.858, 0.5, 0.5),
      vec3(1.658, -0.222, 0.5),
      vec3(2.768, 1.238, 2.508),
      vec3(-0.863, -0.983, 0.757)
    );
    distance = sin(distance * 8.0 + uTime)/8.0;

    distance = abs(distance);

    distance = pow(0.01 / distance, 2.0);

    finalColor += color * distance;
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
