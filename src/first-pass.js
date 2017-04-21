import project from './projection';
import mat4 from 'gl-mat4';

import firstPassFrag from '../shaders/first-pass.frag.glsl';
import firstPassVert from '../shaders/first-pass.vert.glsl';

export default function(regl) {
  return (uniforms, attributes, elements) => {
    return regl({
      frag: firstPassFrag,
      vert: firstPassVert,
      attributes: {
        position: attributes.positions
      },
      uniforms: {
        proj: project,
        model: uniforms.model,
        view: uniforms.view
      },
      elements,
      frontFace: 'ccw',
      // rendering to framebuffer, not canvas
      framebuffer: uniforms.fbo,
      cull: {
        face: 'front',
        enable: true
      }
    });
  };
}
