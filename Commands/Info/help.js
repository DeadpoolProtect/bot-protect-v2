const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all commands or get detailed info about a specific command')
    .setDefaultPermission(true),
  async execute(interaction) {
    const categoriesDir = path.join(__dirname, '../');

    try {
      const categories = readdirSync(categoriesDir);

      const createCategorySelectMenu = (placeholder = 'Choisissez une catégorie') => {
        return new StringSelectMenuBuilder()
          .setCustomId('select-category')
          .setPlaceholder(placeholder)
          .addOptions(
            categories.map(category => ({
              label: category,
              value: category,
            }))
          );
      };

      const actionRow = new ActionRowBuilder().addComponents(createCategorySelectMenu());

      await interaction.reply({
        content: 'Veuillez sélectionner une catégorie pour voir les commandes.',
        components: [actionRow],
        ephemeral: true,
      });

      const filter = i => i.customId === 'select-category' && i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

      collector.on('collect', async i => {
        const selectedCategory = i.values[0];
        const commandsDir = path.join(categoriesDir, selectedCategory);
        const commandFiles = readdirSync(commandsDir).filter(file => file.endsWith('.js'));

        const commands = commandFiles.map(file => {
          const command = require(path.join(commandsDir, file));
          return command.data.toJSON();
        });

        const embed = new EmbedBuilder()
          .setTitle(`Commandes dans la catégorie: ${selectedCategory}`);

        const description = commands.map(cmd => `\`/${cmd.name}\` - ${cmd.description}`).join('\n');
        if (description.length > 0) {
          embed.setDescription(description);
        } else {
          embed.setDescription('Aucune commande trouvée.');
        }

        embed.setColor('Blue');

        const newActionRow = new ActionRowBuilder().addComponents(createCategorySelectMenu('Changer de catégorie'));

        await i.update({ embeds: [embed], components: [newActionRow], ephemeral: true });
      });

      collector.on('end', collected => {
        if (!collected.size) {
          interaction.followUp({ content: 'Le temps est écoulé. Veuillez utiliser `/help` à nouveau si vous avez besoin d\'assistance supplémentaire.', ephemeral: true });
        }
      });
    } catch (error) {
      console.error('Erreur lors de la lecture des catégories:', error);
      interaction.reply({
        content: 'Une erreur est survenue lors de la lecture des catégories. Veuillez réessayer plus tard.',
        ephemeral: true,
      });
    }
  },
};
