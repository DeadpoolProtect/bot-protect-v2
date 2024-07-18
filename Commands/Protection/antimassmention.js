const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const AntimassmentionSchema = require('../../Schema/antimassmention');
const OwnerSchema = require('../../Schema/setownerschema');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('antimassmention')
    .setDescription('Configure l\'antimassmention pour limiter les mentions excessives.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDefaultPermission(false)
    .addBooleanOption(option => 
      option.setName('enabled')
        .setDescription('Activer ou désactiver l\'antimassmention')
        .setRequired(true))
    .addIntegerOption(option => 
      option.setName('mention_limit')
        .setDescription('Nombre maximum de mentions autorisées par message')
        .setRequired(true))
    .addIntegerOption(option => 
      option.setName('timeout_duration')
        .setDescription('Durée du timeout en secondes')
        .setRequired(true)),
  
  async execute(interaction) {
    const { guild, user } = interaction;
    const isOwner = user.id === guild.ownerId;
    const ownerRecord = await OwnerSchema.findOne({ guildId: guild.id, userId: user.id });

    if (!isOwner && !ownerRecord) {
      return interaction.reply({ content: 'Vous n\'avez pas la permission d\'utiliser cette commande.', ephemeral: true });
    }

    const enabled = interaction.options.getBoolean('enabled');
    const mentionLimit = interaction.options.getInteger('mention_limit');
    const timeoutDuration = interaction.options.getInteger('timeout_duration');

    await AntimassmentionSchema.findOneAndUpdate(
      { guildId: guild.id },
      { enabled, mentionLimit, timeoutDuration },
      { upsert: true }
    );

    return interaction.reply({ content: `L'antimassmention a été ${enabled ? 'activé' : 'désactivé'}. Limite de mention: ${mentionLimit}, Durée du timeout: ${timeoutDuration} secondes.`, ephemeral: true });
  },
};
