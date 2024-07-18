const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const VoiceTimeSchema = require('../../Schema/VoiceTimeSchema');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;

    await interaction.deferReply();

    if (interaction.customId === 'vocalreset_yes') {

      if (interaction.user.id !== interaction.guild.ownerId) {
        return interaction.followUp({ content: "Seul le propriétaire du serveur peut utiliser cette commande.", ephemeral: true });
      }

      try {
        await VoiceTimeSchema.deleteMany({ guildId: interaction.guild.id });

        const confirmationEmbed = new EmbedBuilder()
          .setTitle('Réinitialisation du temps vocal')
          .setDescription('Le temps passé en vocal a été réinitialisé pour tous les membres.')
          .setColor('Blue');

        interaction.followUp({ embeds: [confirmationEmbed], components: [] });
      } catch (error) {
        console.error('Une erreur est survenue lors de la réinitialisation du temps vocal :', error);
        interaction.followUp('Une erreur est survenue lors de la réinitialisation du temps vocal.');
      }
    } else if (interaction.customId === 'vocalreset_no') {
      interaction.followUp('Réinitialisation du temps vocal annulée.');
    }
  },
};
