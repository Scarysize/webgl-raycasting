precision mediump float;

varying vec3 worldSpaceCoords;

void main() {
  gl_FragColor = vec4(worldSpaceCoords.xyz, 1);
}
