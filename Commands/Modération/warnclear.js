const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const warningSchema = require('../../Schema/warnsSchema');
const UserColorSchema = require('../../Schema/UserColorSchema');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnclear')
    .setDescription('Supprime les avertissements d\'un utilisateur')
    .addUserOption(option => option
      .setName('target')
      .setDescription('Utilisateur ciblé')
      .setRequired(true)
    ),

  async execute(interaction) {
    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    const errEmbed = new EmbedBuilder()
      .setTitle('ERREUR')
      .setColor(embedColor)
      .setDescription('Permissions manquantes : kick les membres')
      .setTimestamp();

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ embeds: [errEmbed], ephemeral: true});


    const { options, guildId, user } = interaction;

    const target = options.getUser('target');

    const embed = new EmbedBuilder();

    warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: target.tag }, async (err, data) => {
      if (err) throw err;

      if (data) {
        await warningSchema.findOneAndDelete({ GuildID: guildId, UserID: target.id, UserTag: target.tag });

        embed.setColor('Green').setDescription(`:white_check_mark:  ${target.tag} n'a plus d'avertissements !`);

        interaction.reply({ embeds: [embed] });
      } else {
        interaction.reply({ content: `${target.tag} n'a pas encore d'avertissements.`, ephemeral: true });
      }
    });
  }
};
