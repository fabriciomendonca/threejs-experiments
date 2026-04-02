uniform sampler2D uTexture;
uniform vec3 uColor;

void main() {
  float textureAlpha = texture2D(uTexture, gl_PointCoord).r;
  // Final Color
  gl_FragColor = vec4(0.05 / uColor, textureAlpha);
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}