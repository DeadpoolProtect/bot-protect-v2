const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const warningSchema = require('../../Schema/warnsSchema');
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnlist')
    .setDescription('Affiche la liste des avertissements (warns) d\'une guilde.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const guildId = interaction.guild.id;

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    try {
      const warns = await warningSchema.find({ GuildID: guildId });

      if (warns.length === 0) {
        return interaction.reply({
          content: 'Il n\'y a aucun avertissement (warn) dans cette guilde.',
          ephemeral: true,
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('Liste des Avertissements (Warns)')
        .setColor(embedColor)
        .setDescription(`Avertissements (Warns) dans la guilde : ${interaction.guild.name}`);

      warns.forEach((warn) => {
        const { UserID, UserTag, Content } = warn;

        const fields = Content.map((item, index) => {
          return {
            name: `Avertissement ${index + 1}`,
            value: `Modérateur: ${item.ExecuterTag}\nRaison: ${item.Reason}`,
          };
        });

        embed.addFields(fields);
        embed.addFields({ name: `${UserTag} (${UserID})`, value: '\u200B' });
      });

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erreur lors de la récupération des avertissements (warns) :', error);
      return interaction.reply({
        content: 'Une erreur s\'est produite lors de la récupération des avertissements (warns).',
        ephemeral: true,
      });
    }
  },
};
