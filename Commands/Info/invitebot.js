const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('invitebot')
  .setDescription('Obtenir le lien d\'invitation pour ajouter le bot sur votre serveur.'),
  async execute(interaction, client) {

    const guildId = interaction.guild.id;

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle('Inviter katabump')
      .setDescription('Vous souhaitez ajouter katabump sur votre serveur ? Alors voici le lien d\'invitation !')
      .addFields({ name: 'Lien d\'invitation', value: 'https://discord.com/api/oauth2/authorize?client_id=1127907091324080218&permissions=8&scope=bot'})

      return interaction.reply({ embeds: [embed] });
  },
};
