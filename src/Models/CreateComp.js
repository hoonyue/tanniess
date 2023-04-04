const { createCanvas, loadImage } = require('canvas');
const { getRandomSticker } = require('./StickerDropper.js');

async function createStickerCanvas(canvasWidth = 2392, canvasHeight = 1169) {
  console.log('Getting stickers...');
  // Get three random stickers
  const Stickers = [];
  while (Stickers.length < 3) {
    const sticker = await getRandomSticker();
    console.log('Got sticker:', sticker);
    if (!Stickers.some(s => s.id === sticker.id)) {
      Stickers.push(sticker);
    }
  }

  console.log('Loading sticker images...');
  // Load the images of the three stickers
  const stickerImages = await Promise.all(Stickers.map(sticker => loadImage(sticker.image)));

  console.log('Creating canvas...');
  // Create a canvas with the three stickers merged together
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const width = canvasWidth / 3;
  const height = width * stickerImages[0].height / stickerImages[0].width;
  ctx.drawImage(stickerImages[0], 0, 0, width, height);
  ctx.drawImage(stickerImages[1], width, 0, width, height);
  ctx.drawImage(stickerImages[2], width * 2, 0, width, height);

  console.log('Returning canvas and stickers...');
  // Return the canvas and stickers
  return {
    canvas,
    Stickers
  };
}

  module.exports = {
    createStickerCanvas
  };