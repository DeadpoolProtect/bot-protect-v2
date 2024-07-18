const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ChannelSelectMenuBuilder } = require('discord.js');
const LevelSettingsSchema = require('../../Schema/levelSettingsSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level_setup')
    .setDescription('Configure le système de niveaux'),
  async execute(interaction) {
    const guildId = interaction.guild.id;

    const enableDisableSelectMenu = new StringSelectMenuBuilder()
      .setCustomId('select-enable-disable')
      .setPlaceholder('Activer/Désactiver les messages de niveau')
      .addOptions(
        { label: 'Activer', value: 'enable' },
        { label: 'Désactiver', value: 'disable' }
      );

    const actionRowEnableDisable = new ActionRowBuilder().addComponents(enableDisableSelectMenu);

    await interaction.reply({
      content: 'Veuillez sélectionner si vous souhaitez activer ou désactiver les messages de niveau.',
      components: [actionRowEnableDisable],
      ephemeral: true,
    });

    const filter = i => i.customId === 'select-enable-disable' && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      const selectedOption = i.values[0];

      if (selectedOption === 'enable') {
        const channelSelectMenu = new ChannelSelectMenuBuilder()
          .setCustomId('select-channel')
          .setPlaceholder('Sélectionnez un canal pour les messages de niveau')
          .setChannelTypes([0]);

        const actionRowChannelSelect = new ActionRowBuilder().addComponents(channelSelectMenu);

        await i.update({
          content: 'Veuillez sélectionner un canal pour les messages de niveau.',
          components: [actionRowChannelSelect],
          ephemeral: true,
        });

        const channelFilter = j => j.customId === 'select-channel' && j.user.id === interaction.user.id;
        const channelCollector = interaction.channel.createMessageComponentCollector({ channelFilter, time: 60000 });

        channelCollector.on('collect', async j => {
          const selectedChannel = j.values[0];

          await LevelSettingsSchema.findOneAndUpdate(
            { guildId },
            { $set: { enabled: true, channelId: selectedChannel } },
            { upsert: true }
          );

          await j.update({
            content: `Les messages de niveau sont maintenant activés et seront envoyés dans le canal <#${selectedChannel}>.`,
            components: [],
            ephemeral: true,
          });
        });
      } else {
        await LevelSettingsSchema.findOneAndUpdate(
          { guildId },
          { $set: { enabled: false, channelId: null } },
          { upsert: true }
        );

        await i.update({
          content: 'Les messages de niveau sont maintenant désactivés.',
          components: [],
          ephemeral: true,
        });
      }
    });

    collector.on('end', collected => {
      if (!collected.size) {
        interaction.followUp({ content: 'Le temps est écoulé. Veuillez utiliser `/level_setup` à nouveau si vous avez besoin d\'assistance supplémentaire.', ephemeral: true });
      }
    });
  },
};
