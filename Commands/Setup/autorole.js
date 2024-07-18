const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Autorole = require("../../Schema/autorole");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Définit le rôle d'autorole pour les nouveaux membres.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Le rôle d'autorole à attribuer aux nouveaux membres.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Active ou désactive l'autorole.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const role = interaction.options.getRole("role");
    const enabled = interaction.options.getBoolean("enabled");

    await Autorole.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { role: role.id, enabled },
      { upsert: true }
    );

    if (enabled) {
      await interaction.reply(
        `Le rôle d'autorole a été défini sur ${role} et est activé.`
      );
    } else {
      await interaction.reply(
        `Le rôle d'autorole a été défini sur ${role} et est désactivé.`
      );
    }
  },
};