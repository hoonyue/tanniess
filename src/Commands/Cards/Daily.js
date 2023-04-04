const { MessageEmbed } = require('discord.js');
const Profile = require('../../Models/Profile');
const Sticker = require('../../Models/Sticker');
const { getRandomSticker } = require('../../Models/StickerDropper.js');
const moment = require('moment');
const emoji = require('node-emoji');

module.exports = {
  name: 'daily',
  description: 'Claim your daily 150 Gems and a Card!',
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

    if (profile.lastDaily && moment().diff(moment(profile.lastDaily), 'hours') < 24) {
      const timeRemaining = moment.duration(moment(profile.lastDaily).add(24, 'hours').diff(moment())).humanize();
      return interaction.reply(`You've already claimed your daily reward. Come back in ${timeRemaining}.`);
    }

    await interaction.deferReply();

    await profile.updateOne({ $inc: { Diamonds: 150 }, $set: { lastDaily: Date.now() } });

    const chosenSticker = await getRandomSticker();
    profile.Stickers.push(chosenSticker);
    await profile.save();

    const timeLeft = moment.duration(24, 'hours').asSeconds();
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft - hours * 3600) / 60);
    const seconds = Math.floor(timeLeft - hours * 3600 - minutes * 60);

    const starEmoji = '⭐️';
    const rarityStars = starEmoji.repeat(chosenSticker.rarity);

    const sticker = await Sticker.findOne({ id: chosenSticker.id });
    const embed = new MessageEmbed()
      .setAuthor({ name: `${user.username}'s daily...`, iconURL: interaction.user.avatarURL({dynamic: true})})
      .setTitle(`You have claimed \`150 ${emoji.get('gem')}\` \n and a \`\`${sticker.name}\`\` card!`)
      .setImage(sticker.image)
      .setFooter({ text: `${chosenSticker.id} [${rarityStars}] - ${sticker.name}`});

    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setAuthor({ name: `${user.username}'s daily...`, iconURL: interaction.user.avatarURL({dynamic: true})})
          .setTitle(`${interaction.user.username}'s Daily`)
          .setDescription(`You have to wait ${hours}h ${minutes}m ${seconds}s before you can claim your next daily reward.`)
      ]
    });

    await interaction.followUp({ embeds: [embed] });
  }
};