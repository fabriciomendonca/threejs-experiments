varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;

// cosine based palette, 4 vec3 params
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  vec2 uv0 = uv;
  vec3 finalColor = vec3(0.0);
  
  uv = fract(uv * 1.2) - 0.5;
  float d = length(uv) - 0.5;
  d = abs(sin(d * 4.0 + uTime) / 4.0);
  d = smoothstep(0., 0.1, d);
  d *= fract(uv.x * 0.7);
  d = 0.1 / d;
  // d = sin(d + uTime);
  // for(float i = 0.0; i < 2.0; i++){
  //   uv = fract(uv * 1.2) - 0.5;

  //   // float distance = clamp(length(uv) * exp(length(uv0)), 0.0, 1.0);
  //   // vec3 color = palette(
  //   //   length(uv0) + uTime * 1.0 + i * 2.0,
  //   //   vec3(1.858, 0.5, 0.5),
  //   //   vec3(1.658, -0.222, 0.5),
  //   //   vec3(2.768, 1.238, 2.508),
  //   //   vec3(-0.863, -0.983, 0.757)
  //   // );
  //   // distance = sin(distance * 8.0 + uTime)/8.0;

  //   // distance = abs(distance);

  //   // distance = pow(0.01 / distance, 2.0);

  //   // finalColor += color * distance;
  // }
  vec3 col = vec3(sin(uTime * 100.0) / 100.0, cos(uTime * 100.0) / 10.0, sin(uTime * 10.0) / 5.0) * d;

  gl_FragColor = vec4(col,1.0);
}
