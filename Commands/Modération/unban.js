const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const UserColorSchema = require('../../Schema/UserColorSchema');
module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Débannir un utilisateur du serveur")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("L'utilisateur à débannir")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("La raison du débannissement")
        .setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("utilisateur");
    const reason = interaction.options.getString("raison") || "Aucune raison spécifiée";

    const guildId = interaction.guild.id;

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    const embed = new EmbedBuilder()
      .setTitle(`:hammer: ${user.tag} a été débanni`)
      .setDescription(`Raison : ${reason}`)
      .setColor(embedColor);

    try {
      await interaction.guild.bans.remove(user, reason);
      interaction.reply({
        embeds: [embed],
      });
    } catch (err) {
      console.error(err);
      interaction.reply("Une erreur s'est produite lors du débannissement de l'utilisateur.");
    }
  },
};
