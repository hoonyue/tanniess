const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const Profile = require('../../Models/Profile');
const moment = require('moment');
const { createStickerCanvas } = require('../../Models/CreateComp');


module.exports = {
  name: 'drop',
  description: 'Choose a sticker from three random options and claim it.',
  category: 'Cards',
  async run({ interaction, guild, options }) {
    const user = options.getUser('user') || interaction.user;
    const channel = await interaction.client.channels.fetch(interaction.channelId);
    const profile = await Profile.findOne({ UserID: interaction.user.id, GuildID: guild.id });

    if (!profile) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('BLURPLE')
            .setDescription(`You don't have a profile yet. Use the \`/createprofile\` command to create one!`)
        ]
      });
    }

    // Check if the user has already claimed their claim reward in the last 20 minutes
    if (profile.lastDrop && moment().diff(moment(profile.lastDrop), 'minutes') <= 15) {
      const timeRemaining = moment.duration(moment(profile.lastDrop).add(15, 'minutes').diff(moment())).humanize();
      return interaction.reply(`You've already claimed your claim reward in the last 15 minutes. Come back in ${timeRemaining}.`);
    }

    // Defer the reply to immediately acknowledge the command and let the user know that the bot is still processing the request
    await interaction.deferReply();

    // Create the canvas and get the stickers
    const { canvas, Stickers } = await createStickerCanvas();

    // Create a buffer from the canvas image
    const buffer = canvas.toBuffer();

    // Create a message attachment from the buffer
    const attachment = new MessageAttachment(buffer, 'stickers.png');

    // Send the embedded image with the three stickers merged
    const embed = new MessageEmbed()
      .setAuthor({ name: `${user.username} dropped 3 cards...`, iconURL: interaction.user.avatarURL({dynamic: true})})
      .setDescription('click the button of the card you want to claim.')
      .setImage('attachment://stickers.png');

    const message = await interaction.editReply({ embeds: [embed], files: [attachment], fetchReply: true });

    // Create the button row
    const row = new MessageActionRow();

    for (let i = 0; i < 3; i++) {
      // Create a button for each sticker
      const button = new MessageButton()
        .setCustomId(`sticker_${i}`)
        .setLabel(Stickers[i].name)
        .setStyle('PRIMARY');

      // Add the button to the row
      row.addComponents(button);
    }

    // Add the button row to the message
    await message.edit({ components: [row] });

    // Wait for the user to click a button
const filter = (interaction) => interaction.user.id === interaction.user.id && interaction.isButton();
const collector = message.createMessageComponentCollector({ filter, max: 1, time: 30000 });

collector.on('collect', async (interaction) => {
  try {
    console.log('User clicked a button:', interaction.customId);

    // Get the index of the chosen sticker
    const stickerIndex = parseInt(interaction.customId.split('_')[1]);
    console.log('Chosen sticker index:', stickerIndex);

    // Update the user's profile with the chosen sticker
    const chosenSticker = Stickers[stickerIndex];
    if (!profile.Stickers) {
      profile.Stickers = [];
    }
    profile.Stickers.push(chosenSticker);
    await profile.save();
    console.log('User profile updated with chosen sticker:', chosenSticker);

    // Send a confirmation message
    const starEmoji = '⭐️';
    const rarityStars = starEmoji.repeat(chosenSticker.rarity);
    const confirmationEmbed = new MessageEmbed()
      .setColor('GREEN')
      .setDescription(`You have claimed \`${chosenSticker.id} [${rarityStars}]\` - ${chosenSticker.name}!`);
    await interaction.reply({ embeds: [confirmationEmbed] });
    console.log('Confirmation message sent.');

    // Update the last claim time in the user's profile
    profile.lastDrop = moment().toDate();
    await profile.save();
    console.log('User profile updated with last claim time.');
  } catch (error) {
    console.error(error);
    await interaction.reply('There was an error processing your choice. Please try again later.');
    }
    });
  }
}      