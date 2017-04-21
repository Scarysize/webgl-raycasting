import fit from 'canvas-fit';
import initCamera from 'canvas-orbit-camera';
import initRegl from 'regl';
import mat4 from 'gl-mat4';
import {h, render} from 'preact';

import cubeGeometry from './cube';
import loadImage from './load-image';
import transferFunction from './transfer-function';

import firstPass from './first-pass';
import secondPass from './second-pass';

import UI from './ui';

const container = document.querySelector('.canvas-container');
const canvas = container.appendChild(document.createElement('canvas'));
window.addEventListener('resize', fit(canvas), false);
const {width, height} = canvas.getBoundingClientRect();
const regl = initRegl({
  canvas,
  extensions: ['OES_texture_float'],
  optionalExtensions: ['oes_texture_float_linear']
});
const camera = initCamera(canvas);
camera.distance = 3;
camera.rotation = new Float32Array([
  -0.20194266736507416,
  -0.4338509142398834,
  -0.12594525516033173,
  0.8689823746681213
]);

const steps = 256;
const alphaCorrection = 1;

const transferTex = regl.texture({
  data: transferFunction(),
  wrapS: 'clamp',
  wrapT: 'clamp',
  mag: 'linear',
  min: 'linear',
  x: 0,
  y: 0,
  width: 256,
  height: 1,
  alignment: 4
});

render(
  <UI onUpdate={context => transferTex({data: context})} />,
  document.querySelector('#transfer-function')
);

const fbo = regl.framebuffer({
  width,
  height,
  color: regl.texture({
    width,
    height,
    x: 0,
    y: 0,
    mag: 'linear',
    min: 'linear',
    wrapS: 'clamp',
    wrapT: 'clamp',
    type: 'float'
  }),
  colorType: 'float',
  alignment: 4
});

const attributes = {
  positions: regl.buffer(cubeGeometry.positions)
};
const uniforms = {
  fbo,
  transferTex,
  model: mat4.identity([]),
  view: () => camera.view()
};
const elements = cubeGeometry.faces;

function startLoop(cubeTexture) {
  uniforms.cubeTexture = cubeTexture;

  const drawFirstPass = firstPass(regl)(uniforms, attributes, elements);
  const drawSecondPass = secondPass(regl)(uniforms, attributes, elements);

  regl.frame(() => {
    regl.clear({
      color: [0, 0, 0, 0],
      depth: 1,
      framebuffer: fbo
    });
    regl.clear({
      color: [0, 0, 0, 0],
      depth: 1
    });

    drawFirstPass();
    drawSecondPass();

    camera.tick();
  });
}

// Initialize
loadImage('textures/foot.raw.png')
  .then(image =>
    regl.texture({
      mag: 'linear',
      min: 'linear',
      wrapS: 'clamp',
      wrapT: 'clamp',
      flipY: true,
      alignment: 4,
      data: image
    })
  )
  .then(startLoop);
