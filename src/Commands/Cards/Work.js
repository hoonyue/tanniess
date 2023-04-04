const { MessageEmbed } = require('discord.js');
const Profile = require('../../Models/Profile');
const moment = require('moment');
const mongoose = require('mongoose');
const emoji = require('node-emoji');

module.exports = {
  name: 'work',
  description: 'Claim 300 tantans',
  category: 'Cards',
  async run({ interaction, guild, options }) {
    const user = options.getUser('user') || interaction.user;
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
    // Check if the user has already claimed their work reward in the last 20 minutes
    if (profile.lastWork && moment().diff(moment(profile.lastWork), 'minutes') <= 59) {
      const timeRemaining = moment.duration(moment(profile.lastWork).add(59, 'minutes').diff(moment())).humanize();
      return interaction.reply(`You've already claimed your work reward in the last hour. Come back in ${timeRemaining}.`);
    }
    await interaction.deferReply();
    // Update the user's balance and lastWork timestamp
    await profile.updateOne({ $inc: { Coins: 300 }, $set: { lastWork: Date.now() } });

    const messages = [
        "left the house to fight some antis",
        "went on a picknick date with.. WHO?!",
        "was streaming set me free",
        "drank some water",
        "is trying to invent a time machine because",
        "is not sure if they're made for the job",
        "wants to be an astronaut... just like",
        "is not sure if they can survive a concert"
      ];
      
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Get a random sticker and add its id to the user's stickers
    const embed = new MessageEmbed()
        .setAuthor({ name: `${user.username} ${randomMessage}...`, iconURL: interaction.user.avatarURL({dynamic: true})})
        .setDescription(`added 300 \`${emoji.get('coin')}\` to your balance, come back in \`60  mins\` to claim more!`)
      
    await interaction.editReply({ embeds: [embed] });
    
  }
}
