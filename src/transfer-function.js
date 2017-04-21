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
  gradient.addColorStop(0.1, '#ffffff');
  gradient.addColorStop(0.5, '#ff9900');
  gradient.addColorStop(1.0, '#ff0000');

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  return context;
}
