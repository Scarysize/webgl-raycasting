import mat4 from 'gl-mat4';

export default function({viewportWidth, viewportHeight}) {
  return mat4.perspective(
    [],
    Math.PI / 2,
    viewportWidth / viewportHeight,
    0.01,
    1000
  );
}
