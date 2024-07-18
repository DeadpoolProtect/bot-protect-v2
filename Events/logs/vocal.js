const { EmbedBuilder, ChannelType } = require('discord.js');
const LogsSchema = require('../../Schema/LogsSchema');
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    const guild = newState.guild;

    const guildId = guild.id;

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    const logsData = await LogsSchema.findOne({ guildId });
    if (!logsData) return;

    const logsVocalChannelId = logsData.logsChannels.get('📁・logs-vocal');
    if (!logsVocalChannelId) return;

    const logsChannel = guild.channels.cache.get(logsVocalChannelId);
    if (!logsChannel || logsChannel.type !== ChannelType.GuildText) return;

    let action = '';
    if (!oldState.channel && newState.channel) {
      action = 'a rejoint';
    } else if (oldState.channel && !newState.channel) {
      action = 'a quitté';
    } else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
      action = 'a changé de canal';
    } else {
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle('Mise à jour du canal vocal')
      .addFields(
        { name: 'Utilisateur', value: newState.member.user.tag },
        { name: 'Action', value: action.charAt(0).toUpperCase() + action.slice(1) }
      )
      .setTimestamp();

    if (action === 'a rejoint' || action === 'a changé de canal') {
      embed.addFields({ name: 'Nouveau canal', value: newState.channel.name });
    }
    if (action === 'a quitté' || action === 'a changé de canal') {
      embed.addFields({ name: 'Ancien canal', value: oldState.channel ? oldState.channel.name : 'Aucun' });
    }

    await logsChannel.send({ embeds: [embed] });
  },
};
