const Sticker = require('../../Models/Sticker');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'update',
  description: 'update an existing card',
  category: 'Moderation',
  options: [
    {
      name: 'id',
      type: 'STRING',
      description: 'ID of the sticker to update (REQUIRED) in case you want to update the id contact sojin#0001',
      required: true,
    },
    {
      name: 'name',
      type: 'STRING',
      description: 'new name of the sticker',
      required: false,
    },
    {
      name: 'image',
      type: 'STRING',
      description: 'New URL or file path of the card image',
      required: false,
    },
    {
        name: 'rarity',
        type: 'INTEGER',
        description: 'New rarity of the sticker (1-5, -1 for event, 0 for legendary)',
        required: false,
        choices: [
          { name: '1', value: '1' },
          { name: '2', value: '2' },
          { name: '3', value: '3' },
          { name: '4', value: '4' },
          { name: '5', value: '5' },
          { name: 'Event', value: '6' },
          { name: 'Legendary', value: '7' },
        ],
    },
    {
      name: 'tags',
      type: 'STRING',
      description: 'New tags for the sticker (separated by commas)',
      required: false,
    },
    {
      name: 'member',
      type: 'STRING',
      description: 'possible choices: Jungkook, Jimin, Namjoon, Yoongi, Hoseok, Taehyung (separated by commas)',
      choices: [
        {
          name: 'Jungkook',
          value: 'Jungkook',
        },
        {
          name: 'Jimin',
          value: 'Jimin',
        },
        {
          name: 'Namjoon',
          value: 'Namjoon',
        },
        {
          name: 'Yoongi',
          value: 'Yoongi',
        },
        {
          name: 'Hoseok',
          value: 'Hoseok',
        },
        {
          name: 'Taehyung',
          value: 'Taehyung',
        },
        {
        name: 'Jin',
        value: 'Jin',
        },
        ],
      required: false,
    }
  ],
  async run({ interaction, options }) {
    const sticker = await Sticker.findOne({ id });

    if (!sticker) {
      return interaction.reply(`Sticker with ID ${id} not found`);
    }

    // Check if the user has the "MANAGE_MESSAGES" permission
    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return interaction.reply('You do not have permission to use this command');
    }

    const name = options.getString('name');
    const image = options.getString('image');
    const rarity = options.getString('rarity');
    const tags = options.getString('tags');
    const member = options.getString('member');

    // Update the sticker document with the new values if they exist
    try {
        await Sticker.save({ name, image, rarity, tags, member });
  
        const embed = new MessageEmbed()
        .setTitle('card updated successfully!')
        .setImage(sticker.image)
        .setDescription(`**Name**: ${name}\n**Rarity**: ${rarity}\n**ID**: ${id ? id : 'Not provided'}\n**Tags**: ${tags ? tags : 'none provided'}\n**Members**: ${members ? members : 'none provided'}`)
  
        return interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
        return interaction.reply('Error registering sticker');
      }
    }
};