uniform sampler2D uTexture;
uniform vec3 uColor;

void main() {
  vec4 textureData = texture(uTexture, gl_PointCoord);

  vec3 color = textureData.r * uColor;

  gl_FragColor = vec4(color, 1.0);
}