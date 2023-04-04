const Sticker = require('../Models/Sticker');

const dropRates = {
  1: 0.45,
  2: 0.30,
  3: 0.15,
  4: 0.07,
  5: 0.03,
  6: 0,
  7: 0,
};

async function getRandomSticker() {
  console.log('Getting stickers...');
  const stickers = await Sticker.find({}, 'name image rarity id');
  console.log('Stickers retrieved:', stickers.length);
  const totalDropRate = stickers.reduce((acc, sticker) => {
    const rarity = parseInt(sticker.rarity) || 1; // handle case where rarity is a string
    return acc + dropRates[rarity];
  }, 0);
  const dropChances = stickers.map(sticker => {
    const rarity = parseInt(sticker.rarity) || 1; // handle case where rarity is a string
    return { rarity, id: sticker.id, name: sticker.name, image: sticker.image, dropChance: dropRates[rarity] / totalDropRate };
  });

  const randomNumber = Math.random();
  let chosenSticker, accumulatedDropChance = 0;
  for (const dropChance of dropChances) {
    accumulatedDropChance += dropChance.dropChance;
    if (randomNumber <= accumulatedDropChance) {
      chosenSticker = dropChance;
      break;
    }
  }
  console.log('Chosen sticker:', chosenSticker);
  return chosenSticker; 
}

module.exports = { getRandomSticker };
