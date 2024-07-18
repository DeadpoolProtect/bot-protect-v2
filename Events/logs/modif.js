const { EmbedBuilder, ChannelType } = require('discord.js');
const LogsSchema = require('../../Schema/LogsSchema');
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    if (!newMessage.guild || newMessage.author.bot) return;

    const guild = newMessage.guild;
    const guildId = guild.id;

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    const logsData = await LogsSchema.findOne({ guildId: guild.id });
    if (!logsData) return;

    const logsMessageChannelId = logsData.logsChannels.get('📁・logs-message');
    if (!logsMessageChannelId) return;

    const logsChannel = guild.channels.cache.get(logsMessageChannelId);
    if (!logsChannel || logsChannel.type !== ChannelType.GuildText) return;

    if (oldMessage.content === newMessage.content) {
      return; 
    }

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle('Message mis à jour')
      .addFields(
        { name: 'Canal', value: newMessage.channel.name },
        { name: 'Auteur du message', value: newMessage.author.tag },
        { name: 'Contenu d\'origine', value: `\`\`\`${oldMessage.content || 'Aucun'}\`\`\`` },
        { name: 'Nouveau contenu', value: `\`\`\`${newMessage.content || 'Aucun'}\`\`\`` }
      )
      .setTimestamp();

    await logsChannel.send({ embeds: [embed] });
  },
};
