const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const UserColorSchema = require('../../Schema/UserColorSchema');
module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulser un utilisateur du serveur")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("L'utilisateur à expulser")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("La raison de l'expulsion")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("utilisateur");
    const reason = interaction.options.getString("raison") || "Aucune raison spécifiée";
    const member = interaction.guild.members.cache.get(user.id);

    const guildId = interaction.guild.id;

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    const embed = new EmbedBuilder()
      .setTitle(`:boot: ${user.tag} a été expulsé`)
      .setDescription(`Raison : ${reason}`)
      .setColor(embedColor);

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.KickMembers) ||
      interaction.member.roles.highest.position <= member.roles.highest.position
    ) {
      return interaction.reply({
        content: "Vous n'avez pas les permissions pour expulser cet utilisateur.",
        ephemeral: true,
      });
    }

    try {
      await interaction.guild.members.kick(user, { reason });
      interaction.reply({
        embeds: [embed],
      });
    } catch (err) {
      console.error(err);
      interaction.reply("Une erreur s'est produite lors de l'expulsion de l'utilisateur.");
    }
  },
};
