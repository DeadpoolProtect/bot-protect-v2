const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const VoiceTimeSchema = require('../../Schema/VoiceTimeSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vocal_reset')
    .setDescription('Réinitialise le temps passé en vocal pour tous les membres')
    .setDefaultPermission(false),

  async execute(interaction) {
    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply("Seul le propriétaire du serveur peut utiliser cette commande.");
    }

    const confirmationRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Oui')
          .setStyle(ButtonStyle.Primary)
          .setCustomId('vocalreset_yes'),
        new ButtonBuilder()
          .setLabel('Non')
          .setStyle(ButtonStyle.Danger)
          .setCustomId('vocalreset_no')
      );

    const confirmationEmbed = new EmbedBuilder()
      .setTitle('Confirmation de la réinitialisation du temps vocal')
      .setDescription('Êtes-vous sûr de vouloir réinitialiser le temps vocal pour tous les membres ?')
      .setColor('Blue');

    try {
      await interaction.reply({ embeds: [confirmationEmbed], components: [confirmationRow] });
    } catch (error) {
      console.error('Une erreur est survenue lors de l\'envoi du message de confirmation:', error);
      interaction.reply('Une erreur est survenue lors de la réinitialisation du temps vocal.');
    }
  },
};
