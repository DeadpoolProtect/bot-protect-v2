const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const schema = require("../../Schema/setownerschema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearowner")
    .setDescription("Retirer tous les owners.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction, client) {
    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({ content: ":x: Vous n'avez pas les permissions pour utiliser cette commande !", ephemeral: true });
    }

    const removedOwners = await schema.deleteMany({ guildId: interaction.guild.id });

    return interaction.reply({
      content: `Tous les membres ont été retirés de la liste des propriétaires. Total retiré : ${removedOwners.deletedCount}`,
      ephemeral: true,
    });
  },
};
