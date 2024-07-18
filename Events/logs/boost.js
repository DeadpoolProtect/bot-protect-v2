const { EmbedBuilder, ChannelType } = require('discord.js');
const LogsSchema = require('../../Schema/LogsSchema');
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember) {
    const guild = newMember.guild;

    const guildId = guild.id;

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    const logsData = await LogsSchema.findOne({ guildId });
    if (!logsData) {
      return;
    }

    const logsBoostChannelId = logsData.logsChannels.get('📁・logs-boost');
    if (!logsBoostChannelId) {
      return;
    }

    const logsChannel = guild.channels.cache.get(logsBoostChannelId);
    if (!logsChannel || logsChannel.type !== ChannelType.GuildText) {
      return;
    }

    const oldBoosting = oldMember.premiumSince;
    const newBoosting = newMember.premiumSince;

    if (!oldBoosting && newBoosting) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('Serveur boosté')
        .setDescription(`**${newMember.user.tag}** a commencé à booster le serveur !`)
        .setTimestamp();

      await logsChannel.send({ embeds: [embed] });
    } else if (oldBoosting && !newBoosting) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('Boost arrêté')
        .setDescription(`**${newMember.user.tag}** a arrêté de booster le serveur.`)
        .setTimestamp();

      await logsChannel.send({ embeds: [embed] });
    }
  },
};
