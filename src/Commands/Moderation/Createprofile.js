const { MessageEmbed } = require('discord.js');
const Profile = require('../../Models/Profile');
const moment = require('moment');

module.exports = {
  name: 'createprofile',
  description: 'Create a new profile.',
  category: 'Moderation',
  async run({ interaction, guild }) {
    const userID = interaction.user.id;

    // Check if the user already has a profile
    const existingProfile = await Profile.findOne({ UserID: userID, GuildID: guild.id });
    if (existingProfile) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('BLURPLE')
            .setDescription('You already have a profile.')
        ]
      });
    }

    // Create the new profile with default values
    const profile = new Profile({
      UserID: userID,
      Coins: 0,
      Diamonds: 0,
      lastDaily: moment().subtract(25, 'hours').toDate(),
      lastWork: moment().subtract(30, 'minutes').toDate(),
      lastDrop: moment().subtract(30, 'minutes').toDate(),
      Stickers: []
    });

    // Save the new profile to the database
    await profile.save();

    // Send a success message
    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor('BLURPLE')
          .setDescription('Your profile has been created.')
      ]
    });
  }
};