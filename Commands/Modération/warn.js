const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const warningSchema = require('../../Schema/warnsSchema');
const UserColorSchema = require('../../Schema/UserColorSchema');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avertit un utilisateur')
    .addUserOption(option => option
      .setName('target')
      .setDescription('Qui voulez-vous avertir ?')
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName('reason')
      .setDescription('Raison de l\'avertissement')
      .setRequired(true)
    ),

  async execute(interaction) {
    const errEmbed = new EmbedBuilder()
      .setTitle('ERREUR')
      .setColor(embedColor)
      .setDescription('Permissions manquantes : Expulser des membres')
      .setTimestamp();

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ embeds: [errEmbed], ephemeral: true });

    const { options, guildId, user } = interaction;

    const target = options.getUser('target');
    const reason = options.getString('reason');

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    if (target.bot) { 
      const botWarnEmbed = new EmbedBuilder()
        .setTitle('ERREUR')
        .setColor(embedColor)
        .setDescription('Vous ne pouvez pas avertir des bots.')
        .setTimestamp();

      return await interaction.reply({ embeds: [botWarnEmbed], ephemeral: true });
    }

    if (target.id === user.id) { 
      const selfWarnEmbed = new EmbedBuilder()
        .setTitle('ERREUR')
        .setColor(embedColor)
        .setDescription('Vous ne pouvez pas vous avertir vous-même.')
        .setTimestamp();

      return await interaction.reply({ embeds: [selfWarnEmbed], ephemeral: true });
    }

    const userTag = `${target.username}#${target.discriminator}`;

    warningSchema.findOne(
      { GuildID: guildId, UserID: target.id, UserTag: target.tag },
      async (err, data) => {
        if (err) throw err;

        if (!data) {
          data = new warningSchema({
            GuildID: guildId,
            UserID: target.id,
            UserTag: userTag,
            Content: [
              {
                ExecuterId: user.id,
                ExecuterTag: user.tag,
                Reason: reason
              }
            ]
          });
        } else {
          const warnContent = {
            ExecuterId: user.id,
            ExecuterTag: user.tag,
            Reason: reason
          };
          data.Content.push(warnContent);
        }

        data.save();
      }
    );

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setDescription(`:white_check_mark: Vous avez été averti dans ${interaction.guild.name} | ${reason}`);

    const embed2 = new EmbedBuilder()
      .setColor(embedColor)
      .setDescription(`:white_check_mark: ${target.tag} a été averti | ${reason}`);

    target.send({ embeds: [embed] }).catch(err => {
      return;
    });

    interaction.reply({ embeds: [embed2] });
  }
};
