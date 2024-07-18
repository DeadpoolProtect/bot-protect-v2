const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const UserLevelSchema = require('../../Schema/userLevelSchema');
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Affiche votre niveau et votre XP actuel.'),
  
  async execute(interaction) {
    const { guild, user } = interaction;
    const guildId = guild.id;
    const userId = user.id;

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';
    let userLevel = await UserLevelSchema.findOne({ guildId, userId });
    if (!userLevel) {
      userLevel = new UserLevelSchema({ guildId, userId });
      await userLevel.save();
    }

    const xpNeeded = userLevel.level * 100;
    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle(`Niveau de ${user.tag}`)
      .setDescription(`Vous êtes au niveau ${userLevel.level} avec ${userLevel.xp}/${xpNeeded} XP.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
