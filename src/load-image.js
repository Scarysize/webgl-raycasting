export default function(url) {
  const image = new Image();

  return new Promise(resolve => {
    image.onload = () => resolve(image);
    image.src = url;
  });
}
