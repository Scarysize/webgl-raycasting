import project from './projection';
import mat4 from 'gl-mat4';

import firstPassFrag from './shaders/first-pass.frag.glsl';
import firstPassVert from './shaders/first-pass.vert.glsl';

export default class {
  constructor(regl, camera) {
    this.regl = regl;
    this.camera = camera;
  }

  getDrawCommand(renderTarget, attributes, elements) {
    return this.regl({
      frag: firstPassFrag,
      vert: firstPassVert,
      attributes: {
        position: this.regl.buffer(attributes.positions)
      },
      uniforms: {
        proj: project,
        model: mat4.identity([]),
        view: () => this.camera.view()
      },
      elements,
      frontFace: 'ccw',
      // rendering to framebuffer, not canvas
      framebuffer: renderTarget,
      cull: {
        face: 'front',
        enable: true
      }
    });
  }
}
