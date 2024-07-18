const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const UserLevelSchema = require('../../Schema/userLevelSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level_top')
    .setDescription('Affiche les 10 meilleurs utilisateurs par niveau sur le serveur.'),
  
  async execute(interaction) {
    const { guild } = interaction;
    
    const topUsers = await UserLevelSchema.find({ guildId: guild.id })
      .sort({ level: -1, xp: -1 })
      .limit(10);

    const embed = new EmbedBuilder()
      .setTitle('Top 10 des utilisateurs par niveau')
      .setTimestamp();

    if (topUsers.length === 0) {
      embed.setDescription('Aucun utilisateur trouvé.');
    } else {
      topUsers.forEach((user, index) => {
        const member = guild.members.cache.get(user.userId);
        const userName = member ? member.user.tag : 'Utilisateur inconnu';
        embed.addFields({ name: `${index + 1}. ${userName}`, value: `Niveau: ${user.level} | XP: ${user.xp}`, inline: false });
      });
    }

    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
