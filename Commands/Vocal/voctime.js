const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const VoiceTimeSchema = require('../../Schema/VoiceTimeSchema');
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('voctime')
    .setDescription('Affiche le temps total passé en vocal'),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;
    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    try {
      let voiceTimeData = await VoiceTimeSchema.findOne({ guildId, userId });
      if (!voiceTimeData) {
        voiceTimeData = new VoiceTimeSchema({ guildId, userId });
      }

      const voiceChannelId = interaction.member?.voice?.channel?.id;
      const currentTime = Date.now();

      if (voiceChannelId) {
        voiceTimeData.timeInVoice += currentTime - (voiceTimeData.lastJoinTime || currentTime);
        voiceTimeData.lastJoinTime = currentTime;
        await voiceTimeData.save();
      }

      const totalTimeInVoice = voiceTimeData.timeInVoice;

      const totalSeconds = Math.floor(totalTimeInVoice / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;
      const remainingSeconds = totalSeconds % 60;

      const embed = new EmbedBuilder()
        .setTitle('Temps passé en vocal')
        .setDescription(`Tu as passé un total de ${totalHours} heures, ${remainingMinutes} minutes et ${remainingSeconds} secondes en vocal.`)
        .setColor(embedColor);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Une erreur est survenue lors de l\'exécution de la commande voctime:', error);
      interaction.reply('Une erreur est survenue lors du calcul du temps en vocal.');
    }
  },
};