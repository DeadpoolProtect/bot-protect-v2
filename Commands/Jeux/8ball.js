const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Posez une question à la boule magique 8.')
    .addStringOption(option => 
      option.setName('question')
      .setDescription('La question que vous voulez poser.')
      .setRequired(true)
    ),

  async execute(interaction) {
    const responses = [
      'C\'est certain.',
      'Probablement.',
      'Pas sûr.',
      'Pas de réponse.',
      'Ne comptez pas dessus.',
      'Je ne peux pas prédire maintenant.',
      'Très probablement.',
      'Oui, définitivement.',
      'Non, jamais.',
      'Peut-être un jour.'
    ];

    const question = interaction.options.getString('question');
    const response = responses[Math.floor(Math.random() * responses.length)];

    const guildId = interaction.guild.id;

    try {
      const userColorData = await UserColorSchema.findOne({ guildId });
      const embedColor = userColorData ? userColorData.color : 'Red';

      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('Boule magique 8')
        .setDescription(`Question : ${question}\nRéponse : ${response}`)
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/8-Ball_Pool.svg/1200px-8-Ball_Pool.svg.png')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching user color:', error);
      await interaction.reply('Une erreur est survenue lors de la récupération de la couleur de l\'utilisateur.');
    }
  },
};
