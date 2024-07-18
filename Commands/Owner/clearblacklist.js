const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const BlacklistSchema = require("../../Schema/blacklist");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear_blacklist")
        .setDescription("Retire tous les utilisateurs de la liste noire de la guilde.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction, client) {
        if (interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({ content: ":x: Vous n'avez pas les permissions pour utiliser cette commande !", ephemeral: true });
          }
          
        try {
            const result = await BlacklistSchema.deleteMany({ guildId: interaction.guild.id });

            if (result.deletedCount === 0) {
                return interaction.reply({ content: ":x: Aucun utilisateur n'a été trouvé dans la liste noire.", ephemeral: true });
            }

            return interaction.reply({ content: `:white_check_mark: ${result.deletedCount} utilisateur(s) ont été retiré(s) de la liste noire.`, ephemeral: true });
        } catch (err) {
            console.error(err);
            return interaction.reply({ content: ":x: Une erreur s'est produite lors de la suppression de la liste noire.", ephemeral: true });
        }
    }
};
