const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const AntilinksSchema = require("../../Schema/antilinks");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("antilinks")
    .setDescription("Gérer les paramètres du système antilinks.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption((option) =>
      option
        .setName("active")
        .setDescription("Activer ou désactiver le système antilinks.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("temps_du_mute")
        .setDescription("Définir le temps de mute en seconde (par défaut 15).")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("allowgif")
        .setDescription("Autoriser les GIFs.")
        .setRequired(false)
        .addChoices({ name: "Oui", value: "oui" })
        .addChoices({ name: "Non", value: "non" })
    ),
  category: "Modération",
  async execute(interaction) {
    const isActive = interaction.options.getBoolean("active");
    const tempsMuteStr = interaction.options.getString("temps_du_mute");
    const allowGifStr = interaction.options.getString("allowgif");

    const tempsMute = tempsMuteStr ? parseInt(tempsMuteStr, 10) : 15;

    await interaction.deferReply({ ephemeral: true });

    try {
      const guildId = interaction.guildId;

      let antilinksData = await AntilinksSchema.findOneAndUpdate(
        { guildId },
        { active: isActive },
        { upsert: true, new: true }
      );

      await interaction.followUp(
        isActive ? "Le système antilinks a été activé." : "Le système antilinks a été désactivé."
      );

      antilinksData.time = tempsMute;
      await antilinksData.save();

      await interaction.followUp(`Le temps de mute a été défini à ${tempsMute} secondes.`);

      if (allowGifStr) {
        antilinksData.allowGif = (allowGifStr === "oui");
        await antilinksData.save();
        await interaction.followUp(`L'autorisation des GIF a été mise à jour : ${allowGifStr}.`);
      }
    } catch (error) {
      console.error(error);
      await interaction.followUp(
        "Une erreur s'est produite lors de la gestion du système antilinks."
      );
    }
  },
};
