const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Profile = require('../../Models/Profile');
const Sticker = require('../../Models/Sticker');
const starEmoji = '⭐️';

module.exports = {
  name: 'inv',
  description: 'Display the user\'s inventory',
  category: 'Cards',
  async run({ interaction }) {
      const userID = interaction.user.id;
      const profile = await Profile.findOne({ UserID: userID }).populate('Stickers');

      if (!profile || !profile.Stickers || profile.Stickers.length === 0) {
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor('BLURPLE')
              .setDescription(`Your inventory is empty.`)
          ]
        });
      }

      // Merge the stickers and count their quantity
      const mergedStickers = profile.Stickers.reduce((acc, sticker) => {
        const existingSticker = acc.find(s => s.id === sticker.id);
        if (existingSticker) {
          existingSticker.quantity++;
        } else {
          acc.push({ ...sticker.toObject(), quantity: 1 });
        }
        return acc;
      }, []);

      // Sort the merged stickers by rarity in descending order
      mergedStickers.sort((a, b) => b.rarity - a.rarity);

      const stickersPerPage = 8;
      const totalPages = Math.ceil(mergedStickers.length / stickersPerPage);

      let page = 1;
      let startIndex = 0;
      let endIndex = Math.min(startIndex + stickersPerPage, mergedStickers.length);

      const stickerList = mergedStickers.slice(startIndex, endIndex).map(sticker => {
        const rarityStars = starEmoji.repeat(sticker.rarity);
        return `||\`${sticker.id}\`||[${rarityStars}] - [${sticker.name}](${sticker.image})${sticker.quantity > 1 ? ` (x${sticker.quantity})` : ''}`;
      });

      const embed = new MessageEmbed()
        .setColor('BLURPLE')
        .setTitle(`${interaction.user.username}'s inventory:`)
        .setDescription(stickerList.join('\n'))
        .setFooter(`Page ${page} of ${totalPages}`);

      const previousButton = new MessageButton()
        .setCustomId('previous')
        .setLabel('Previous')
        .setStyle('SECONDARY')
        .setDisabled(true);

      const nextButton = new MessageButton()
        .setCustomId('next')
        .setLabel('Next')
        .setStyle('SECONDARY')
        .setDisabled(totalPages === 1);

      const row = new MessageActionRow()
        .addComponents(previousButton, nextButton);

      const reply = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
      
      const filter = (buttonInteraction) => {
        return buttonInteraction.message.id === reply.id && buttonInteraction.user.id === userID;
      };
      
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        componentType: 'BUTTON',
        time: 60000
      });
      
      collector.on('collect', async buttonInteraction => {
        if (buttonInteraction.user.id !== userID) {
          return buttonInteraction.reply({
            content: 'You are not authorized to interact with this message.',
            ephemeral: true
          });
        }
      
        if (buttonInteraction.customId === 'previous') {
          page--;
        } else if (buttonInteraction.customId === 'next') {
          page++;
        }
      
        startIndex = (page - 1) * stickersPerPage;
        endIndex = Math.min(startIndex + stickersPerPage, mergedStickers.length);
      
        const pageStickers = mergedStickers.slice(startIndex, endIndex);
      
        const stickerList = pageStickers.map(sticker => {
          const rarityStars = starEmoji.repeat(sticker.rarity);
          const count = profile.Stickers.filter(s => s.id === sticker.id).length;
          const countString = count > 1 ? ` (x${count})` : '';
          return `||\`${sticker.id}\`||[${rarityStars}] - [${sticker.name}](${sticker.image})${countString}`;
        });
      
        const embed = new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(`${interaction.user.username}'s inventory:`)
          .setDescription(stickerList.join('\n'))
          .setFooter(`Page ${page} of ${totalPages}`);
      
        previousButton.setDisabled(page === 1);
        nextButton.setDisabled(page === totalPages);
      
        await buttonInteraction.update({
          embeds: [embed],
          components: [row]
        });
      
        // Stop the collector if the user requests a new message
        if (buttonInteraction.customId === 'new_message') {
          collector.stop();
        }
      });
      collector.on('end', async () => {
        previousButton.setDisabled(true);
        nextButton.setDisabled(true);
      
        await reply.edit({ components: [row] });
      });
    }
  }
