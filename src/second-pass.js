import project from './projection';
import mat4 from 'gl-mat4';

import secondPassFrag from '../shaders/second-pass.frag.glsl';
import secondPassVert from '../shaders/second-pass.vert.glsl';

export default function(regl) {
  return (uniforms, attributes, elements) => {
    return regl({
      frag: secondPassFrag,
      vert: secondPassVert,
      attributes: {
        position: attributes.positions
      },
      uniforms: {
        proj: project,
        model: uniforms.model,
        view: uniforms.view,
        cubeTex: uniforms.cubeTexture,
        transferTex: uniforms.transferTex,
        tex: uniforms.fbo,
        steps: 256,
        alphaCorrection: 0.1
      },
      elements,
      cull: {
        face: 'back',
        enable: true
      },
      frontFace: 'ccw',
      framebuffer: null
    });
  };
}
