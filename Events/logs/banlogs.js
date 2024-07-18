const { EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const LogsSchema = require('../../Schema/LogsSchema');
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  name: 'guildBanAdd',
  async execute(guild, user) {
    const guildId = guild.id;

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    const logsData = await LogsSchema.findOne({ guildId });
    if (!logsData) return;

    const logsBanChannelId = logsData.logsChannels.get('📁・logs-ban');
    if (!logsBanChannelId) return;

    const logsChannel = guild.channels.cache.get(logsBanChannelId);
    if (!logsChannel || logsChannel.type !== ChannelType.GuildText) return;

    const botPermissions = logsChannel.permissionsFor(guild.me);
    if (!botPermissions.has(PermissionFlagsBits.ViewChannel) || !botPermissions.has(PermissionFlagsBits.SendMessages)) return;

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle('Membre banni')
      .setDescription(`**${user.tag}** a été banni du serveur.`)
      .setTimestamp();

    await logsChannel.send({ embeds: [embed] });
  },
};
