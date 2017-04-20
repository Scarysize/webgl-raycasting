precision mediump float;

uniform mat4 proj;
uniform mat4 model;
uniform mat4 view;

attribute vec3 position;

varying vec3 worldSpaceCoords;
varying vec4 projectedCoords;

void main() {
  worldSpaceCoords = (model * vec4(position + vec3(0.5, 0.5, 0.5), 1.0)).xyz;
  gl_Position = proj * view * model * vec4(position, 1.0);
  projectedCoords = proj * view * model * vec4(position, 1.0);
}
