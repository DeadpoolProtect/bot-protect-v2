const { Events } = require('discord.js');
const AntijoinsSchema = require('../../Schema/antijoins');
const OwnerSchema = require('../../Schema/setownerschema');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const guildId = member.guild.id;

        const antijoinsSettings = await AntijoinsSchema.findOne({ guildId });

        if (antijoinsSettings && antijoinsSettings.active) {
            const isOwner = member.id === member.guild.ownerId;
            const ownerRecord = await OwnerSchema.findOne({ guildId, userId: member.id });

            if (!isOwner && !ownerRecord) {
                await member.kick('Anti-joins activé : Les nouveaux membres ne sont pas autorisés sur ce serveur.');
                console.log(`Membre ${member.user.tag} a été expulsé de ${member.guild.name} car l'anti-joins est activé.`);
            }
        }
    },
};
