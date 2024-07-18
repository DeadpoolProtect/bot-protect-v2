const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mixname')
    .setDescription('Combine le début du nom d\'un utilisateur avec la fin du nom d\'un autre utilisateur')
    .addUserOption(option =>
      option.setName('utilisateur1')
        .setDescription('Le premier utilisateur')
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName('utilisateur2')
        .setDescription('Le deuxième utilisateur')
        .setRequired(true)
    ),
  execute(interaction) {
    const user1 = interaction.options.getUser('utilisateur1');
    const user2 = interaction.options.getUser('utilisateur2');

    const name1 = user1.username;
    const name2 = user2.username;

    const mixedName = mixNames(name1, name2);

    interaction.reply(`Le nom mixte est : ${mixedName}`);
  },
};


function mixNames(name1, name2) {
  const name1Length = Math.floor(name1.length / 2);
  const name2Length = Math.floor(name2.length / 2);
  
  const mixedName = name1.slice(0, name1Length) + name2.slice(name2Length);
  return mixedName;
}
