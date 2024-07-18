const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const UserLevelSchema = require('../../Schema/userLevelSchema');
const OwnerSchema = require('../../Schema/setownerschema');
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level_add_xp')
    .setDescription('Ajoute de l\'XP à un utilisateur spécifique.')
    .addUserOption(option => 
      option.setName('utilisateur')
        .setDescription('L\'utilisateur à qui ajouter de l\'XP')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('xp')
        .setDescription('La quantité d\'XP à ajouter')
        .setRequired(true)),
  
  async execute(interaction) {
    const { guild, user } = interaction;
    const isOwner = user.id === guild.ownerId;
    const ownerRecord = await OwnerSchema.findOne({ guildId: guild.id, userId: user.id });


    if (!isOwner && !ownerRecord) {
      return interaction.reply({ content: 'Vous n\'avez pas la permission d\'utiliser cette commande.', ephemeral: true });
    }

    const targetUser = interaction.options.getUser('utilisateur');
    const xpToAdd = interaction.options.getInteger('xp');

    const guildId = guild.id;
    const userId = targetUser.id;

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    let userLevel = await UserLevelSchema.findOne({ guildId, userId });
    if (!userLevel) {
      userLevel = new UserLevelSchema({ guildId, userId });
    }

    userLevel.xp += xpToAdd;

    const xpNeeded = userLevel.level * 100;

    while (userLevel.xp >= xpNeeded) {
      userLevel.level++;
      userLevel.xp -= xpNeeded;
    }

    await userLevel.save();

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setDescription(`Ajouté ${xpToAdd} XP à ${targetUser.tag}. Niveau actuel: ${userLevel.level}, XP actuel: ${userLevel.xp}.`);

    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
