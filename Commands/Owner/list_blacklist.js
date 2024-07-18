const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const BlacklistSchema = require("../../Schema/blacklist");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("list_blacklist")
        .setDescription("Affiche tous les utilisateurs blacklistés sur la guilde.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction, client) {
        if (interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({ content: ":x: Vous n'avez pas les permissions pour utiliser cette commande !", ephemeral: true });
          }
        try {
            const blacklist = await BlacklistSchema.find({ guildId: interaction.guild.id });

            if (blacklist.length === 0) {
                return interaction.reply({ content: ":x: Il n'y a aucun utilisateur blacklisté sur cette guilde.", ephemeral: true });
            }

            let replyMessage = "Liste des utilisateurs blacklistés :\n";
            blacklist.forEach((entry, index) => {
                replyMessage += `${index + 1}. <@${entry.userId}> - Raison : ${entry.reason}\n`;
            });

            return interaction.reply({ content: replyMessage, ephemeral: true });
        } catch (err) {
            console.error(err);
            return interaction.reply({ content: ":x: Une erreur s'est produite lors de la récupération de la liste noire.", ephemeral: true });
        }
    }
};
