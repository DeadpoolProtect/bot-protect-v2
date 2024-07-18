const { EmbedBuilder, ChannelType, AuditLogEvent } = require('discord.js');
const LogsSchema = require('../../Schema/LogsSchema');
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  name: 'messageDelete',
  async execute(message) {
    if (!message.guild || !message.author || message.author.bot) return;

    const guild = message.guild;

    const guildId = guild.id;

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    const logsData = await LogsSchema.findOne({ guildId: guild.id });
    if (!logsData) return;

    const logsMessageChannelId = logsData.logsChannels.get('📁・logs-message');
    if (!logsMessageChannelId) return;

    const logsChannel = guild.channels.cache.get(logsMessageChannelId);
    if (!logsChannel || logsChannel.type !== ChannelType.GuildText) return;

    const auditLogs = await guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MessageDelete,
    });

    const deletionLog = auditLogs.entries.first();
    const deleter = deletionLog ? deletionLog.executor : null; 

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle('Message supprimé')
      .addFields(
        { name: 'Canal', value: message.channel.name },
        { name: 'Auteur du message', value: message.author.tag },
      )
      .setTimestamp();

    if (message.content) {
      embed.addFields({ name: 'Contenu du message', value: `\`\`\`${message.content}\`\`\`` });
    }

    await logsChannel.send({ embeds: [embed] });
  },
};
