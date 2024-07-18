const { EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
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
    if (!logsData) return;

    const logsRolesChannelId = logsData.logsChannels.get('📁・logs-roles');
    if (!logsRolesChannelId) return;

    const logsChannel = guild.channels.cache.get(logsRolesChannelId);
    if (!logsChannel || logsChannel.type !== ChannelType.GuildText) return;

    const botPermissions = logsChannel.permissionsFor(guild.members.me);
    if (!botPermissions.has(PermissionFlagsBits.ViewChannel) || !botPermissions.has(PermissionFlagsBits.SendMessages)) return;

    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;

    const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
    const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

    if (addedRoles.size > 0) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('Rôle(s) ajouté(s)')
        .setDescription(`**${newMember.user.tag}** a reçu le(s) rôle(s) suivant(s) :`)
        .addFields(
          { name: 'Rôle(s) ajouté(s)', value: addedRoles.map(role => role.name).join(', ') }
        )
        .setTimestamp();

      await logsChannel.send({ embeds: [embed] });
    }

    if (removedRoles.size > 0) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('Rôle(s) retiré(s)')
        .setDescription(`**${newMember.user.tag}** a perdu le(s) rôle(s) suivant(s) :`)
        .addFields(
          { name: 'Rôle(s) retiré(s)', value: removedRoles.map(role => role.name).join(', ') }
        )
        .setTimestamp();

      await logsChannel.send({ embeds: [embed] });
    }
  },
};
