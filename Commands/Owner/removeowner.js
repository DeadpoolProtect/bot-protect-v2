const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const schema = require("../../Schema/setownerschema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removeowner")
    .setDescription("Retirer un owner.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addUserOption((x) => x.setName("membre").setDescription("Membre à retirer de la liste.").setRequired(true)),
  async execute(interaction, client) {
    let user = interaction.options.getUser("membre");

    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({ content: ":x: Vous n'avez pas les permissions pour utiliser cette commande !", ephemeral: true });
    }

    let findDB = await schema.findOneAndDelete({ guildId: interaction.guild.id, userId: user.id });

    if (!findDB) {
      return interaction.reply({ content: ":x: Le membre n'est pas présent dans la liste !", ephemeral: true });
    }

    return interaction.reply({ content: "Le membre a été retiré de la liste !", ephemeral: true });
  },
};