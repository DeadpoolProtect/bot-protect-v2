const { Client, GuildMember } = require('discord.js');
const Autorole = require('../../Schema/autorole');

module.exports = {
  name: 'guildMemberAdd',
  once: false,
  async execute(member) {
    if (!(member instanceof GuildMember)) return;
    
    const autoroleData = await Autorole.findOne({ guildId: member.guild.id });
    if (!autoroleData || !autoroleData.enabled) return;
    
    const roleId = autoroleData.role;
    const role = member.guild.roles.cache.get(roleId);
    
    if (role) {
      member.roles.add(role)
        .catch(console.error);
    }
  }
};
