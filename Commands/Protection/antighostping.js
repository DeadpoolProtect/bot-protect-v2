const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const AntiGhostPingSchema = require('../../Schema/antighostping');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antighostping')
    .setDescription('Active ou désactive la protection contre les ghost pings.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption(option =>
      option.setName('activer')
        .setDescription('Activer ou désactiver la protection.')
        .setRequired(true)
    ),

  async execute(interaction) {
    const { guildId, options } = interaction;
    const activer = options.getBoolean('activer');

    try {
      let antiGhostPingData = await AntiGhostPingSchema.findOne({ guildId });

      if (activer) {
        if (antiGhostPingData) {
          antiGhostPingData.active = true;
        } else {
          antiGhostPingData = new AntiGhostPingSchema({ guildId, active: true });
        }
        await antiGhostPingData.save();
        await interaction.reply('La protection contre les ghost pings a été activée.');
      } else {
        if (antiGhostPingData) {
          antiGhostPingData.active = false;
          await antiGhostPingData.save();
          await interaction.reply('La protection contre les ghost pings a été désactivée.');
        } else {
          await interaction.reply('La protection contre les ghost pings n\'est pas activée dans ce serveur.');
        }
      }
    } catch (error) {
      console.error(error);
      await interaction.reply('Une erreur s\'est produite lors de la modification de la protection contre les ghost pings.');
    }
  },
};
