precision mediump float;

uniform mat4 proj;
uniform mat4 model;
uniform mat4 view;

attribute vec3 position;

void main() {
  gl_Position = proj * view * model * vec4(position, 1.0);
}
