const BlacklistSchema = require("../../Schema/blacklist");

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        try {
            const findDB = await BlacklistSchema.findOne({ guildId: member.guild.id, userId: member.id });

            if (findDB) {
                await member.ban({ reason: `Blacklisted: ${findDB.reason}` });
                console.log(`L'utilisateur ${member.user.tag} a été banni car il est dans la liste noire.`);
            }
        } catch (err) {
            console.error(`Erreur lors de la tentative de bannissement de l'utilisateur ${member.user.tag} :`, err);
        }
    }
};
