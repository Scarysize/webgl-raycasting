export default function() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 20;
  canvas.style.width = '256px';
  canvas.style.height = '20px';
  canvas.style.position = 'fixed';

  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(
    0,
    0,
    canvas.width - 1,
    canvas.height - 1
  );
  gradient.addColorStop(0.0, '#ff0000');
  gradient.addColorStop(0.5, '#ff0000');
  gradient.addColorStop(1.0, '#ffff00');

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  document.body.appendChild(canvas);

  return context;
}
