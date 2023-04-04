const { MessageEmbed } = require('discord.js');
const Profile = require('../../Models/Profile');
const moment = require('moment');
const emoji = require('node-emoji');

module.exports = {
  name: 'cds',
  description: 'Show remaining cooldowns for a user',
  category: 'General',
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

    const cooldowns = [];

    if (profile.lastDaily && moment().diff(moment(profile.lastDaily), 'hours') <= 23) {
      const timeRemaining = moment.duration(moment(profile.lastDaily).add(23, 'hours').diff(moment())).asMinutes().toFixed(0);
      const hoursText = Math.floor(timeRemaining / 60) > 0 ? `${Math.floor(timeRemaining / 60)}hrs ` : '';
      const minutesText = `${Math.floor(timeRemaining % 60)}min`;
      cooldowns.push(`\`${emoji.get('calendar')}\` **Daily** : in ${hoursText}${minutesText}`);
    } else {
      cooldowns.push(`\`${emoji.get('calendar')}\` **Daily** : ${emoji.get('white_check_mark')}`);
    }

    if (profile.lastWork && moment().diff(moment(profile.lastWork), 'minutes') <= 59) {
      const timeRemaining = moment.duration(moment(profile.lastWork).add(59, 'minutes').diff(moment())).asMinutes().toFixed(0);
      cooldowns.push(`\`${emoji.get('briefcase')}\` **Work** : in ${timeRemaining} min`);
    } else {
      cooldowns.push(`\`${emoji.get('briefcase')}\` **Work** : ${emoji.get('white_check_mark')}`);
    }

    if (profile.lastDrop && moment().diff(moment(profile.lastDrop), 'minutes') <= 15) {
      const timeRemaining = moment.duration(moment(profile.lastDrop).add(15, 'minutes').diff(moment())).asMinutes().toFixed(0);
      cooldowns.push(`\`${emoji.get('black_joker')}\` **Drop** : in ${timeRemaining} min`);
    } else {
      cooldowns.push(`\`${emoji.get('black_joker')}\` **Drop** : ${emoji.get('white_check_mark')}`);
    }

    const embed = new MessageEmbed()
      .setAuthor({ name: `checking ${user.username}'s cooldowns...`, iconURL: interaction.user.avatarURL({dynamic: true})})
      .setDescription(cooldowns.join('\n'))
      .setTimestamp()
      await interaction.reply({ embeds: [embed] });
      }
    }
  