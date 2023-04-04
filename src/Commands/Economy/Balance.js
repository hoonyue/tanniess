const { MessageEmbed } = require('discord.js');
const Profile = require('../../Models/Profile');
const { createProfile } = require('../../Structures/Utils');
const emoji = require('node-emoji');

module.exports = {
  name: 'balance',
  description: "Check user's balance.",
  category: 'Economy',
  options: [
    {
      name: 'user',
      description: 'Mention user.',
      required: false,
      type: 'USER'
    }
  ],
  async run({ interaction, options, bot, guild }) {
    const user = options.getUser('user') || interaction.user;
    const profile = await Profile.findOne({ UserID: user.id });
    if (!profile) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor('BLURPLE')
            .setDescription(`${user.username} doesn't have a profile yet. Use the \`/createprofile\` command to create one!`)
        ]
      });
    }
    
    const balances = [];
    const balanceCoins = profile.Coins || 0;
    const balanceDiamonds = profile.Diamonds || 0;

    if (balanceCoins >= 1000) {
      balances.push(`\`${emoji.get('coin')}\` **Coins : ${(balanceCoins / 1000).toFixed(1)}K**`);
    } else {
      balances.push(`\`${emoji.get('coin')}\` **Coins : ${balanceCoins}**`);
    }
    
    if (balanceDiamonds >= 1000) {
      balances.push(`\`${emoji.get('gem')}\` **Diamonds : ${(balanceDiamonds / 1000).toFixed(1)}K**`);
    } else {
      balances.push(`\`${emoji.get('gem')}\` **Diamonds : ${balanceDiamonds}**`);
    }
    
    await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setAuthor({ name: `checking ${user.username}'s balance...`, iconURL: interaction.user.avatarURL({dynamic: true})})
            .setDescription(balances.join('\n'))
            .setTimestamp()
        ]
      })
    }
  }
