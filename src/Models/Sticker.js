const mongoose = require('mongoose');
const { Schema } = mongoose;

const StickerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rarity: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      unique: true,
      minlength: 1,
      maxlength: 4,
      default: function () {
        return Math.floor(1000 + Math.random() * 9000).toString();
      },
    },
    tags: {
      type: String,
      required: false,
    },
    member: {
      type: String,
      enum: ['Jungkook', 'Jimin', 'Namjoon', 'Yoongi', 'Hoseok', 'Taehyung', 'Jin'],
      required: false,
    },
  },
);


module.exports = mongoose.model('Sticker', StickerSchema);
