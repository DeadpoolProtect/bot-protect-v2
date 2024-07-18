const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ChannelType,
} = require("discord.js");
const VoiceTimeSchema = require("../../Schema/VoiceTimeSchema");
const UserColorSchema = require('../../Schema/UserColorSchema');
const usersPerPage = 20;

module.exports = {
  data: new SlashCommandBuilder()
      .setName("voctime_list")
      .setDescription("Affiche tout les membres qui sont allés en vocal dans le serveur")
      .addStringOption(option => option.setName("page").setDescription("Page à afficher").setRequired(false)),

  async execute(interaction) {
      const guildId = interaction.guild.id;
      const voiceTimeData = await VoiceTimeSchema.find({ guildId }).sort({ timeInVoice: -1 });
      const totalPages = Math.ceil(voiceTimeData.length / usersPerPage);
      const userColorData = await UserColorSchema.findOne({ guildId });
      const embedColor = userColorData ? userColorData.color : 'Red';
      let page = parseInt(interaction.options.getString("page")) || 1;
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;

      const startIndex = (page - 1) * usersPerPage;
      const usersToShow = voiceTimeData.slice(startIndex, startIndex + usersPerPage);

      const embed = new EmbedBuilder()
          .setTitle("Top présence en vocal ")
          .setColor(embedColor)
          .setDescription(`Page ${page}/${totalPages}`)
          .setTimestamp();

      let place = 1;

      for (const userData of usersToShow) {
          const user = interaction.guild.members.cache.get(userData.userId);
          if (user) {
              const totalSeconds = Math.floor(userData.timeInVoice / 1000);
              const totalMinutes = Math.floor(totalSeconds / 60);
              const totalHours = Math.floor(totalMinutes / 60);
              const remainingMinutes = totalMinutes % 60;
              const remainingSeconds = totalSeconds % 60;

              const formattedTime = `${totalHours}h, ${remainingMinutes}m`;
              
              embed.addFields({ name: `${place.toString().padStart(2, '0')} | ${user.displayName} 👑`, value: `${formattedTime} (Total : ${totalHours}h ${remainingMinutes}m)` });
              
              place++;
          }
      }

      const previousButton = new ButtonBuilder()
          .setLabel("Précédent")
          .setStyle(ButtonStyle.Primary)
          .setCustomId(`voctime_list_${page - 1}`)
          .setDisabled(page === 1);

      const nextButton = new ButtonBuilder()
          .setLabel("Suivant")
          .setStyle(ButtonStyle.Primary)
          .setCustomId(`voctime_list_${page + 1}`)
          .setDisabled(page === totalPages);

      const row = new ActionRowBuilder()
          .addComponents(previousButton, nextButton);

      interaction.reply({ embeds: [embed], components: [row] });
  },
};
