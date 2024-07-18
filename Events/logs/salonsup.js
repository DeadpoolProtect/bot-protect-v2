const { EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const LogsSchema = require('../../Schema/LogsSchema');
const UserColorSchema = require('../../Schema/UserColorSchema');


module.exports = {
    name: 'channelDelete',
    async execute(channel) {
      const guild = channel.guild;
      const guildId = guild.id;
  
      const userColorData = await UserColorSchema.findOne({ guildId });
      const embedColor = userColorData ? userColorData.color : 'Red';
  
      const logsData = await LogsSchema.findOne({ guildId });
      if (!logsData) return;
  
      const logsChannelId = logsData.logsChannels.get('📁・logs-channel');
      if (!logsChannelId) return;
  
      const logsChannel = guild.channels.cache.get(logsChannelId);
      if (!logsChannel || logsChannel.type !== ChannelType.GuildText) return;
  
      const botPermissions = logsChannel.permissionsFor(guild.members.me);
      if (!botPermissions.has(PermissionFlagsBits.ViewChannel) || !botPermissions.has(PermissionFlagsBits.SendMessages)) return;
  
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('Canal Supprimé')
      .setDescription(`Le canal **${channel.type === ChannelType.GuildText ? 'textuel' : 'vocal'}**  **${channel.name}** a été supprimé.`)
        .setTimestamp();
  
      await logsChannel.send({ embeds: [embed] });
    },
  };
  