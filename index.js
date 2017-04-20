import fit from 'canvas-fit';
import initCamera from 'canvas-orbit-camera';
import initRegl from 'regl';
import mat4 from 'gl-mat4';

import cubeGeometry from './cube';
import loadImage from './load-image';
import project from './projection';
import transferFunction from './transfer-function';

import FirstPassRenderer from './first-pass';
import SecondPassRenderer from './second-pass';

const container = document.querySelector('.canvas-container');
const canvas = container.appendChild(document.createElement('canvas'));
window.addEventListener('resize', fit(canvas), false);
const regl = initRegl({
  canvas,
  extensions: ['OES_texture_float'],
  optionalExtensions: ['oes_texture_float_linear']
});
const camera = initCamera(canvas);
window.camera = camera;
camera.distance = 3;
camera.rotation = new Float32Array([
  -0.20194266736507416,
  -0.4338509142398834,
  -0.12594525516033173,
  0.8689823746681213
]);

const steps = 256;
const alphaCorrection = 5;

const transferTex = regl.texture({
  data: transferFunction(),
  wrapS: 'clamp',
  wrapT: 'clamp',
  mag: 'linear',
  min: 'linear',
  x: 0,
  y: 0,
  width: 256,
  height: 1
});

const renderTarget = regl.framebuffer({
  width: window.innerWidth,
  height: window.innerHeight,
  color: regl.texture({
    width: window.innerWidth,
    height: window.innerHeight,
    x: 0,
    y: 0,
    mag: 'linear',
    min: 'linear',
    wrapS: 'clamp',
    wrapT: 'clamp',
    type: 'float'
  }),
  colorType: 'float'
});

const attributes = {
  positions: cubeGeometry.positions
};
const elements = cubeGeometry.faces;
const uniforms = {
  firstPassTexture: renderTarget,
  transferTex
};

function startLoop(cubeTexture) {
  uniforms.cubeTexture = cubeTexture;
  const firstPassRenderer = new FirstPassRenderer(regl, camera);
  const secondPassRenderer = new SecondPassRenderer(regl, camera);

  const drawFirstPass = firstPassRenderer.getDrawCommand(
    renderTarget,
    attributes,
    elements
  );
  const drawSecondPass = secondPassRenderer.getDrawCommand(
    uniforms,
    attributes,
    elements
  );
  regl.frame(() => {
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1,
      framebuffer: renderTarget
    });
    regl.clear({
      color: [1, 1, 1, 1],
      depth: 1
    });
    camera.tick();

    drawFirstPass();
    drawSecondPass();
  });
}

const volumeTextureOptions = {
  mag: 'linear',
  min: 'linear',
  wrapS: 'clamp',
  wrapT: 'clamp',
  flipY: true
};

loadImage('foot.raw.png')
  .then(image =>
    regl.texture({
      ...volumeTextureOptions,
      data: image
    })
  )
  .then(startLoop);
// loadImage('teapot.raw.png')
//   .then(image =>
//     regl.texture({
//       ...volumeTextureOptions,
//       data: image
//     })
//   )
//   .then(startLoop);
