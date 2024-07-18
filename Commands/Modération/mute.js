const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const UserColorSchema = require('../../Schema/UserColorSchema');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute un utilisateur trop bruyant')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option => option.setName('user').setDescription('L\'utilisateur spécifié sera timeout.').setRequired(true))
    .addNumberOption(option => option.setName('time').setDescription(`La durée spécifiée sera appliquée au setTimeout de l'utilisateur spécifié.`).setRequired(true))
    .addStringOption(option => option.setName('time-type').setDescription(`Définissez le type de valeur de temps que vous souhaitez utiliser (s, m, h, d).`).setRequired(false))
    .addStringOption(option => option.setName('reason').setDescription(`Fournissez la raison pour laquelle vous souhaitez expirer cet utilisateur.`).setRequired(false)),
    async execute(interaction) {

        const guildId = interaction.guild.id;

        const userColorData = await UserColorSchema.findOne({ guildId });
        const embedColor = userColorData ? userColorData.color : 'Red';

        const timedisplay = interaction.options.getNumber('time');
        const user = interaction.options.getMember('user');
        const username = interaction.options.getUser('user');
        let time = interaction.options.getNumber('time');
        const type = interaction.options.getString('time-type') || 's';
        const reason = interaction.options.getString('reason') || 'Aucune raison fournie :(';

        if (username.id === interaction.user.id) return await interaction.reply({ content: `Vous **ne pouvez pas** vous timeout tu réflechi !`, ephemeral: true})

        if (
            !interaction.member.permissions.has(PermissionFlagsBits.BanMembers) ||
            interaction.member.roles.highest.position <= user.roles.highest.position
        ) {
            return interaction.reply({
                content: "Vous n'avez pas les autorisations pour mettre en sourdine cet utilisateur.",
                ephemeral: true,
            });
        }

        if(type === 's') time = time * 1000;
        if(type === 'm') time = time * 60000;
        if(type === 'h') time = time * 3600000;
        if(type === 'd') time = time * 86400000;

        if (time < 5000) {
            return await interaction.reply({ content: `Le timeout **ne peut pas** être inférieur à 6 secondes.`, ephemeral: true})
        }

        if (time > 2073600000) {
            return await interaction.reply({ content: `Le Timeout **ne peut pas** être inférieur à 24 jours.`, ephemeral: true})
        }


        const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setAuthor({ name: '🔨 Timeout'})
        .setTitle(`> L'utilisateur a été mis en sourdine !`)
        .addFields({ name: '• Utilisateur', value: `> ${username.tag}`, inline: true})
        .addFields({ name: '• Raison', value: `> ${reason}`, inline: true})
        .addFields({ name: '• Durée', value: `> ${timedisplay}${type}`, inline: true})
        .setThumbnail('https://cdn.discordapp.com/avatars/1025079577447514215/3ea03406942c3d18785169f383aed40c.webp?size=1024')
        .setFooter({ text: '🔨 Quelqu\'un a été mis en sourdine'})
        .setTimestamp()

        user.timeout(time).catch(err => {
            return interaction.reply({ content: `**Impossible** d'exclure ce membre! Vérifiez mes **permissons** et réessayez.`, ephemeral: true})
        })

        await interaction.reply({ embeds: [embed] })
    }
}