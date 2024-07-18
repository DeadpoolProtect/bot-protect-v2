const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const schema = require("../../Schema/setownerschema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list_owner")
    .setDescription("Afficher la liste des propriétaires.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction, client) {
    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({ content: ":x: Vous n'avez pas les permissions pour utiliser cette commande !", ephemeral: true });
    }

    const owners = await schema.find({ guildId: interaction.guild.id });

    if (owners.length === 0) {
      const embedNoOwners = new EmbedBuilder()
        .setTitle("Liste des Propriétaires")
        .setDescription("Il n'y a actuellement aucun propriétaire défini.");

      return interaction.reply({ embeds: [embedNoOwners], ephemeral: true });
    }

    const ownerList = owners.map((owner) => `<@${owner.userId}>`).join("\n");

    const embedOwners = new EmbedBuilder()
      .setTitle("Liste des Propriétaires")
      .setDescription(ownerList);

    return interaction.reply({ embeds: [embedOwners], ephemeral: true });
  },
};
