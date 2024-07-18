const { Events, EmbedBuilder } = require('discord.js');
const UserLevelSchema = require('../../Schema/userLevelSchema');
const LevelSettingsSchema = require('../../Schema/levelSettingsSchema');
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot || !message.guild) return;
    const guildId = message.guild.id;
    const userId = message.author.id;

    const xpToAdd = 10;

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';


    let userLevel = await UserLevelSchema.findOne({ guildId, userId });
    if (!userLevel) {
      userLevel = new UserLevelSchema({ guildId, userId });
    }

    userLevel.xp += xpToAdd;
    const xpNeeded = userLevel.level * 100;

    if (userLevel.xp >= xpNeeded) {
      userLevel.level++;
      userLevel.xp -= xpNeeded;

      const levelUpEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription(`Félicitations ${message.author}, vous êtes passé au niveau ${userLevel.level} !`);

      const levelSettings = await LevelSettingsSchema.findOne({ guildId });

      if (levelSettings && levelSettings.enabled && levelSettings.channelId) {
        const levelChannel = message.guild.channels.cache.get(levelSettings.channelId);
        if (levelChannel) {
          levelChannel.send({ embeds: [levelUpEmbed] });
        } else {
          message.channel.send({ embeds: [levelUpEmbed] });
        }
      } else {
        message.channel.send({ embeds: [levelUpEmbed] });
      }
    }

    await userLevel.save();
  },
};
