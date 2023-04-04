const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const Sticker = require('../../Models/Sticker');

module.exports = {
  name: 'register',
  description: 'register a card to the database',
  category: 'Moderation',
  options: [
    {
      name: 'name',
      type: 'STRING',
      description: 'Name of the Card',
      required: false,
    },
    {
      name: 'image',
      type: 'STRING',
      description: 'URL or file path of the Cards image',
      required: false,
    },
    {
      name: 'rarity',
      type: 'INTEGER',
      description: 'rarity of the sticker',
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
      name: 'id',
      type: 'INTEGER',
      description: 'ID of the sticker (4-digit number)',
      required: false,
    },
    {
      name: 'tags',
      type: 'STRING',
      description: 'Tags for the sticker (separated by commas)',
      required: false,
    },
    {
      name: 'member',
      type: 'STRING',
      description: 'possible choices: Jungkook, Jimin, Namjoon, Yoongi, Hoseok, Taehyung (separated by commas)',
      required: false,
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
        {
            name: 'Group',
            value: 'Group',
        },
      ],
    } 
  ],
  async run(interaction) {
    console.log(interaction.options);

    const name = interaction.options.getString('name');
    const image = interaction.options.getString('image');
    const rarity = interaction.options.getInteger('rarity');
    const id = interaction.options.getInteger('id');
    const tags = interaction.options.getString('tags');
    const member = interaction.options.getString('member');

    // Check if the sticker with the provided ID already exists in the database
    if (id && await Sticker.findOne({ id })) {
      return interaction.reply(`A sticker with the ID ${id} already exists in the database.`);
    }
    try {
    // Create a new Sticker document with the provided information
    const newSticker = await Sticker.create({ name, image, rarity, id, tags, member,
    });


    // Create a success message with an embed
    const successEmbed = new MessageEmbed()
      .setTitle('card registered successfully!')
      .setImage(newSticker.image)
      .setDescription(`**Name**: ${name}\n**Rarity**: ${rarity}\n**ID**: ${id ? id : 'Not provided'}\n**Tags**: ${tags ? tags : 'none provided'}\n**Members**: ${member ? member : 'none provided'}`)

      return interaction.reply({ embeds: [successEmbed] });
    } catch (error) {
      console.error(error);
      return interaction.reply('Error registering sticker');
    }
  }
};
    // Send the success message