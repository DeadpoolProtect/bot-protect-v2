const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gay')
    .setDescription('Indique votre pourcentage de gay.'),
  async execute(interaction) {
    const gayPercentage = Math.floor(Math.random() * 101);
    const user = interaction.user;

    const guildId = interaction.guild.id;

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    const embed = new EmbedBuilder()
      .setTitle(`:rainbow_flag: ${user.username}, vous êtes ${gayPercentage}% gay.`)
      .setColor(embedColor);

    interaction.reply({ embeds: [embed] });
  },
};
