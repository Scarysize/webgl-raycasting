import project from './projection';
import mat4 from 'gl-mat4';

import secondPassFrag from './shaders/second-pass.frag.glsl';
import secondPassVert from './shaders/second-pass.vert.glsl';

export default class {
  constructor(regl, camera) {
    this.regl = regl;
    this.camera = camera;
  }

  getDrawCommand(uniforms, attributes, elements) {
    return this.regl({
      frag: secondPassFrag,
      vert: secondPassVert,
      attributes: {
        position: this.regl.buffer(attributes.positions)
      },
      uniforms: {
        proj: project,
        model: mat4.identity([]),
        view: () => this.camera.view(),
        cubeTex: uniforms.cubeTexture,
        transferTex: uniforms.transferTex,
        tex: uniforms.firstPassTexture,
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
  }
}
