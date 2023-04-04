const Sticker = require('../../Models/Sticker');
const Profile = require('../../Models/Profile');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'give',
  description: 'Give a user a sticker by ID',
  options: [
    {
      name: 'user',
      type: 'USER',
      description: 'The user to give the sticker to',
      required: true,
    },
    {
      name: 'sticker-id',
      type: 'INTEGER',
      description: 'The ID of the sticker to give',
      required: true,
    },
  ],
  async run(interaction) {
    const stickerId = interaction.options.getInteger('sticker-id');
    const userId = interaction.options.getUser('user').id;
    const userr = interaction.user;
    const sticker = await Sticker.findOne({ id: stickerId });

    if (!sticker) {
      return interaction.reply(`Could not find sticker with ID ${stickerId}`);
    }

    const user = await Profile.findOne({ UserID: userId });

    if (!user) {
      return interaction.reply(`Could not find user with ID ${userId}`);
    }

    user.Stickers.push({
      rarity: sticker.rarity,
      id: sticker.id,
      name: sticker.name,
      image: sticker.image,
      tags: sticker.tags,
      member: sticker.member,
    });

    await user.save();

    const starEmoji = '⭐️';
    const rarityStars = starEmoji.repeat(sticker.rarity);

    const embed = new MessageEmbed()
      .setTitle(`<@${userId}> received a ${sticker.name} card!`)
      .setImage(sticker.image)
      .setFooter({ text: `${sticker.id} [${rarityStars}] - ${sticker.name}`});

    return interaction.reply({ embeds: [embed] });
  },
};
