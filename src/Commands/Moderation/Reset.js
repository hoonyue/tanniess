const Profile = require('../../Models/Profile');

module.exports = {
  name: 'reset-cd',
  description: 'Removes the cooldown of the /drop and /work command.',
  category: 'Moderation',
  async run({ interaction }) {
    const profile = await Profile.findOne({ UserID: interaction.user.id, GuildID: interaction.guildId });

    if (!profile) {
      return interaction.reply('Your profile was not found.');
    }

    const thirtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000);
    const twentyFour = new Date(Date.now() - 1000 * 60 * 60 * 30 )
    await profile.updateOne({ $set: { lastWork: thirtyMinutesAgo, lastDrop: thirtyMinutesAgo, lastDaily: twentyFour } });

    return interaction.reply('Cooldowns have been removed!');
  },
};
