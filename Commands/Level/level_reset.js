const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, PermissionFlagsBits } = require('discord.js');
const UserLevelSchema = require('../../Schema/userLevelSchema');
const OwnerSchema = require('../../Schema/setownerschema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level_reset')
    .setDescription('Réinitialiser les niveaux de tous les utilisateurs sur le serveur.'),
  
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, user } = interaction;
    const guildId = guild.id;
    const userId = user.id;

    const isOwner = user.id === guild.ownerId;
    const ownerRecord = await OwnerSchema.findOne({ guildId, userId });

    if (!isOwner && !ownerRecord) {
      return interaction.reply({ content: 'Vous n\'avez pas la permission d\'utiliser cette commande.', ephemeral: true });
    }

    await UserLevelSchema.deleteMany({ guildId });

    return interaction.reply({ content: 'Tous les niveaux des utilisateurs ont été réinitialisés.', ephemeral: true });
  },
};
