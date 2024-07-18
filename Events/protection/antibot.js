const { Events, AuditLogEvent } = require('discord.js');
const AntibotSchema = require('../../Schema/antibot');
const OwnerSchema = require('../../Schema/setownerschema');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const guildId = member.guild.id;

        const antibotSettings = await AntibotSchema.findOne({ guildId });

        if (antibotSettings && antibotSettings.active && member.user.bot) {
            const auditLogs = await member.guild.fetchAuditLogs({ type: AuditLogEvent.BotAdd, limit: 1 });
            const botAddLog = auditLogs.entries.first();

            if (botAddLog) {
                const { executor } = botAddLog;

                if (executor.id === member.guild.ownerId) {
                    console.log(`Le bot ${member.user.tag} a été ajouté par ${executor.tag}, qui est le propriétaire du serveur.`);
                    return;
                }

                const owner = await OwnerSchema.findOne({ guildId, userId: executor.id });

                if (owner) {
                    console.log(`Le bot ${member.user.tag} a été ajouté par ${executor.tag}, qui est un propriétaire.`);
                    return;
                }
            }

            await member.kick('Antibot activé : Les bots ne sont pas autorisés sur ce serveur.');
            console.log(`Bot ${member.user.tag} a été expulsé de ${member.guild.name} car l'antibot est activé.`);
        }
    },
};
