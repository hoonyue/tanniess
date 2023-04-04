const { plural } = require('../Structures/Utils');

module.exports = {
  event: 'ready',
  async run(bot) {
    bot.user.setPresence({ activities: [{ name: `Like Crazy`, type: 'STREAMING', url: `https://www.youtube.com/watch?v=nOI67IDlNMQ&ab_channel=HYBELABELS`}] });
    bot.logger.success(`${bot.user.tag} is now logged in!`);
    bot.logger.info(
      `Loaded ${bot.commands.size} commands for ${bot.guilds.cache.size} guild${plural(bot.guilds.cache.size)}.`
    );
  }
};
