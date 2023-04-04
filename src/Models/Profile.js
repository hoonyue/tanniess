const { model, Schema } = require('mongoose');

module.exports = model(
  'Profile',
  new Schema({
    UserID: String,
    Coins: Number,
    Diamonds: Number,
    lastDaily: Date,
    lastWork: Date,
    lastDrop: Date,
    Stickers: {
      type: [
        {
          rarity: Number,
          id: {
            type: String,
            minlength: 4,
            maxlength: 4,
            default: function () {
              return Math.floor(1000 + Math.random() * 9000).toString();
            },
          },
          name: String,
          image: String,
        },
      ],
      required: true,
      default: [],
    },
  })
);
