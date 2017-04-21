precision mediump float;

varying vec3 worldSpaceCoords;
varying vec4 projectedCoords;

uniform sampler2D tex;
uniform sampler2D cubeTex;
uniform sampler2D transferTex;
uniform float steps;
uniform float alphaCorrection;

// The maximum distance through our rendering volume is sqrt(3).
// The maximum number of steps we take to travel a distance of 1 is 512.
// ceil( sqrt(3) * 512 ) = 887
// This prevents the back of the image from getting cut off when steps=512 &
// viewing diagonally.
const int MAX_STEPS = 887;

// Acts like a texture3D using Z slices and trilinear filtering.
vec4 sampleAs3DTexture(vec3 texCoord) {
  vec4 colorSlice1;
  vec4 colorSlice2;
  vec2 texCoordSlice1;
  vec2 texCoordSlice2;

  // The z coordinate determines which Z slice we have to look for.
  // Z slice number goes from 0 to 255.
  float zSliceNumber1 = floor(texCoord.z * 255.0);

  // As we use trilinear we go the next Z slice.
  float zSliceNumber2 = min(zSliceNumber1 + 1.0, 255.0); // Clamp to 255

  // The Z slices are stored in a matrix of 16x16 of Z slices.
  // The original UV coordinates have to be rescaled by the tile numbers in each
  // row and column.
  texCoord.xy /= 16.0;

  texCoordSlice1 = texCoordSlice2 = texCoord.xy;

  // Add an offset to the original UV coordinates depending on the row and
  // column number.
  texCoordSlice1.x += (mod(zSliceNumber1, 16.0) / 16.0);
  texCoordSlice1.y += floor((255.0 - zSliceNumber1) / 16.0) / 16.0;

  texCoordSlice2.x += (mod(zSliceNumber2, 16.0) / 16.0);
  texCoordSlice2.y += floor((255.0 - zSliceNumber2) / 16.0) / 16.0;

  // Get the opacity value from the 2D texture.
  // Bilinear filtering is done at each texture2D by default.
  colorSlice1 = texture2D(cubeTex, texCoordSlice1);
  colorSlice2 = texture2D(cubeTex, texCoordSlice2);

  // TODO: only interpolate the sampled alpha values, then do the transfer lookup

  // Based on the opacity obtained earlier, get the RGB color in the transfer
  // function texture.
  colorSlice1.rgb = texture2D(transferTex, vec2(colorSlice1.a, 1.0)).rgb;
  colorSlice2.rgb = texture2D(transferTex, vec2(colorSlice2.a, 1.0)).rgb;

  // How distant is zSlice1 to ZSlice2. Used to interpolate between one Z slice
  // and the other.
  float zDifference = mod(texCoord.z * 255.0, 1.0);

  // Finally interpolate between the two intermediate colors of each Z slice.
  return mix(colorSlice1, colorSlice2, zDifference);
}

void main(void) {
  // Transform the coordinates it from [-1;1] to [0;1]
  vec2 texc = vec2(((projectedCoords.x / projectedCoords.w) + 1.0) / 2.0,
                   ((projectedCoords.y / projectedCoords.w) + 1.0) / 2.0);

  // The back position is the world space position stored in the texture.
  vec3 backPos = texture2D(tex, texc).xyz;

  // The front position is the world space position of the second render pass.
  vec3 frontPos = worldSpaceCoords;

  // The direction from the front position to back position.
  vec3 dir = backPos - frontPos;

  float rayLength = length(dir);

  // Calculate how long to increment in each step.
  float delta = 1.0 / steps;

  // The increment in each direction for each step.
  vec3 deltaDirection = normalize(dir) * delta;
  float deltaDirectionLength = length(deltaDirection);

  // Start the ray casting from the front position.
  vec3 currentPosition = frontPos;

  // The color accumulator.
  vec4 accumulatedColor = vec4(0.0);

  // The alpha value accumulated so far.
  float accumulatedAlpha = 0.0;

  // How long has the ray travelled so far.
  float accumulatedLength = 0.0;

  // If we have twice as many samples, we only need ~1/2 the alpha per sample.
  // Scaling by 256/10 just happens to give a good value for the alphaCorrection
  // slider.
  float alphaScaleFactor = 25.6 * delta;

  vec4 colorSample;
  float alphaSample;

  // Perform the ray marching iterations
  for (int i = 0; i < MAX_STEPS; i++) {
    // Get the voxel intensity value from the 3D texture.
    colorSample = sampleAs3DTexture(currentPosition);

    // Allow the alpha correction customization.
    alphaSample = colorSample.a * alphaCorrection;

    // Applying this effect to both the color and alpha accumulation results in
    // more realistic transparency.
    alphaSample *= (1.0 - accumulatedAlpha);

    // Scaling alpha by the number of steps makes the final color invariant to
    // the step size.
    alphaSample *= alphaScaleFactor;

    // Perform the composition.
    accumulatedColor += colorSample * alphaSample;

    // Store the alpha accumulated so far.
    accumulatedAlpha += alphaSample;

    // Advance the ray.
    currentPosition += deltaDirection;
    accumulatedLength += deltaDirectionLength;

    // If the length traversed is more than the ray length, or if the alpha
    // accumulated reaches 1.0 then exit.
    if (accumulatedLength >= rayLength || accumulatedAlpha >= 1.0)
      break;
  }

  gl_FragColor = accumulatedColor;
}
