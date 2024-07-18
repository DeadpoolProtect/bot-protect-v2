const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bannir un utilisateur du serveur")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("L'utilisateur à bannir")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("La raison du bannissement")
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
      .setTitle(`:hammer: ${user.tag} a été banni`)
      .setDescription(`Raison : ${reason}`)
      .setColor(embedColor);

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.BanMembers) ||
      interaction.member.roles.highest.position <= member.roles.highest.position
    ) {
      return interaction.reply({
        content: "Vous n'avez pas les permissions pour bannir cet utilisateur.",
        ephemeral: true,
      });
    }

    try {
      await interaction.guild.members.ban(user, { reason });
      interaction.reply({
        embeds: [embed],
      });
    } catch (err) {
      console.error(err);
      interaction.reply("je n'ai pas les permissions pour bannir cet utilisateur. Vérifiez bien mes permissions pour vous assurer que je suis au-dessus de lui.");
    }
  },
};
