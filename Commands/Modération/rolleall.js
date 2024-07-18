const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roleall')
    .setDescription('Donne un rôle à tous les membres du serveur')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Le rôle à donner à tous les membres')
        .setRequired(true)),
  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const botMember = interaction.guild.members.cache.get(interaction.client.user.id); // Obtenez le membre du bot

    const guildId = interaction.guild.id;

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
      const noPermissionEmbed = new EmbedBuilder()
        .setTitle('ERREUR')
        .setColor(embedColor)
        .setDescription('Je n\'ai pas la permission de gérer les rôles.')
        .setTimestamp();

      return interaction.reply({ embeds: [noPermissionEmbed] });
    }

    if (role.position >= botMember.roles.highest.position) {
      const roleTooHighEmbed = new EmbedBuilder()
        .setTitle('ERREUR')
        .setColor(embedColor)
        .setDescription('Je ne peux pas donner ce rôle car il est positionné plus haut que mon rôle le plus élevé.')
        .setTimestamp();

      return interaction.reply({ embeds: [roleTooHighEmbed] });
    }

    const members = await interaction.guild.members.fetch();

    members.forEach(async (member) => {
      try { 
        await member.roles.add(role);
      } catch (error) {
        console.error(`Impossible de donner le rôle ${role.name} à ${member.user.tag}: ${error}`);
      }
    });

    const embed = new EmbedBuilder()
      .setTitle('Rôle attribué à tous les membres')
      .setDescription(`Le rôle ${role} a été donné à tous les membres du serveur, y compris les bots.`)
      .setColor(embedColor)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
