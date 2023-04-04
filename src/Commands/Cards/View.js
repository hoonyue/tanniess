const { MessageEmbed } = require('discord.js');
const Sticker = require('../../Models/Sticker');

module.exports = {
  name: 'view',
  description: 'View a registered sticker',
  category: 'Cards',
  options: [
    {
      name: 'id',
      description: 'The ID of the sticker',
      type: 'INTEGER',
      required: true,
    }
  ],

  async run({ interaction }) {
    const id = interaction.options.getInteger('id');
    const sticker = await Sticker.findOne({ Id: id }); // fix: use uppercase 'I' in 'Id'

    if (!sticker) {
      return interaction.reply({ content: 'That sticker could not be found!', ephemeral: true });
    }

    const { name: stickerName, image, rarity } = sticker;

    const embed = new MessageEmbed()
      .setTitle(stickerName) // fix: use 'stickerName' variable
      .setImage(image)
      .setFooter({
        text: `Rarity: ${rarity}`,
        iconURL: 'https://example.com/footer-icon.png',
      });

    return interaction.reply({ embeds: [embed] });
  }
};
