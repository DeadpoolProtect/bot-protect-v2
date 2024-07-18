const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const AntibotSchema = require('../../Schema/antibot');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('antibot')
        .setDescription('Active ou désactive l\'antibot pour ce serveur.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption(option => option
            .setName('activer')
            .setDescription('Active ou désactive l\'antibot')
            .setRequired(true)),
    
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const active = interaction.options.getBoolean('activer');

        let antibotSettings = await AntibotSchema.findOne({ guildId });

        if (!antibotSettings) {
            antibotSettings = new AntibotSchema({ guildId, active });
        } else {
            antibotSettings.active = active;
        }

        await antibotSettings.save();

        await interaction.reply(`L'antibot a été ${active ? 'activé' : 'désactivé'} avec succès.`);
    },
};
