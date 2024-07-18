const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const AntijoinsSchema = require('../../Schema/antijoins');
const OwnerSchema = require('../../Schema/setownerschema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('antijoins')
        .setDescription('Active ou désactive la fonctionnalité anti-joins.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption(option => option.setName('active').setDescription('Activer ou désactiver l\'anti-joins').setRequired(true)),
    async execute(interaction) {
        const { guild, user } = interaction;
        const isOwner = user.id === guild.ownerId;
        const ownerRecord = await OwnerSchema.findOne({ guildId: guild.id, userId: user.id });

        if (!isOwner && !ownerRecord) {
            return interaction.reply({ content: 'Vous n\'avez pas la permission d\'utiliser cette commande.', ephemeral: true });
        }

        const active = interaction.options.getBoolean('active');

        await AntijoinsSchema.findOneAndUpdate(
            { guildId: guild.id },
            { guildId: guild.id, active },
            { upsert: true, new: true }
        );

        interaction.reply({ content: `La fonctionnalité anti-joins a été ${active ? 'activée' : 'désactivée'}.`, ephemeral: true });
    },
};
