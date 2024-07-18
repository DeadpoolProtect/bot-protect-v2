const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('qi')
    .setDescription('Calculer votre QI'),

  async execute(interaction) {
    const userId = '1003018100549111848'; 
    const min = 70;
    const max = userId === interaction.user.id ? 999 : 140; 
    const qi = Math.floor(Math.random() * (max - min + 1)) + min;
    let message = '';
    let color = '';

    if (qi >= 130 && qi <= 140) {
      message = `Votre QI est de ${qi}. Votre intelligence est très supérieure ! Einstein serait content de vous !`;
      color = 'Blue';
    } else if (qi >= 120 && qi <= 129) {
      message = `Votre QI est de ${qi}. Votre intelligence est supérieure (6,7% de la population)`;
      color = 'Blue';
    } else if (qi >= 110 && qi <= 119) {
      message = `Votre QI est de ${qi}. Votre intelligence est au-dessus de la moyenne (16,1% de la population)`;
      color = 'Blue';
    } else if (qi >= 90 && qi <= 109) {
      message = `Votre QI est de ${qi}. Votre intelligence est moyenne (50% de la population)`;
      color = 'Blue';
    } else if (qi >= 80 && qi <= 89) {
      message = `Votre QI est de ${qi}. Votre intelligence est normale faible, en dessous de la moyenne (16,1% de la population)`;
      color = 'Blue';
    } else {
      message = `Votre QI est de ${qi}. Vous êtes un génie incompris !`;
      color = 'Blue';
    }
    const guildId = interaction.guild.id;

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    const embed = new EmbedBuilder()
      .setTitle('Résultat de votre test de QI')
      .setDescription(message)
      .setColor(embedColor);

    await interaction.reply({ embeds: [embed] });
  },
};
