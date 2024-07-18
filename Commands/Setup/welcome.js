const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  PermissionFlagsBits,
} = require("discord.js");
const welcomeSchema = require(`../../Schema/welcomeSchema`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`welcome`)
    .setDescription(`Configurer un message de bienvenue`)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`set`)
        .setDescription(`Mots clés = {mention}, {user}, {servername}, {totalmembers}`)
        .addChannelOption((option) =>
          option
            .setName(`channel`)
            .setDescription(`Le canal pour envoyer le message de bienvenue`)
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName(`message`)
            .setDescription(`Configurer le message du welcome`)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`remove`)
        .setDescription(`Supprime le système d'accueil`)
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`preview`)
        .setDescription(`Prévisualiser le message de bienvenue`)
    ),

  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: `Vous avez besoin d'un administrateur pour exécuter cette commande!`,
        ephemeral: true,
      });

    if (interaction.options.getSubcommand() === `set`) {
      const data = await welcomeSchema.findOne({
        guildid: interaction.guild.id,
      });

      if (data) {
        const channel = interaction.options.getChannel(`channel`);
        const message = interaction.options.getString(`message`);

        await welcomeSchema.findOneAndUpdate({
          guildid: interaction.guild.id,
          channel: channel.id,
          message: message,
        });

        await data.save();

        const embed1 = new EmbedBuilder()
          .setColor(`#00FFFF`)
          .setTitle(`Système d'accueil`)
          .setDescription(
            `Le message de bienvenue est mis à jour pour ${message} dans le canal ${channel}`
          )
          .setTimestamp();

        await interaction.reply({ embeds: [embed1] });
      }

      if (!data) {
        const channel = interaction.options.getChannel(`channel`);
        const message = interaction.options.getString(`message`);
        const data = await welcomeSchema.create({
          guildid: interaction.guild.id,
          channel: channel.id,
          message: message,
        });

        await data.save();

        const embed = new EmbedBuilder()
          .setColor(`#00FFFF`)
          .setTitle(`Système d'accueil`)
          .setDescription(
            `Le message de bienvenue est défini sur "${message}" dans le canal ${channel}`
          )
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      }
    }

    if (interaction.options.getSubcommand() === `remove`) {
      const data = await welcomeSchema.findOne({
        guildid: interaction.guild.id,
      });

      if (!data) {
        await interaction.reply({
          content: `Aucun message de bienvenue trouvé!`,
          ephemeral: true,
        });
      } else {
        await welcomeSchema.findOneAndDelete({
          guildid: interaction.guild.id,
        });

        const embed3 = new EmbedBuilder()
          .setColor(`Aqua`)
          .setTitle(`Système d'accueil`)
          .setDescription(`Message de bienvenue supprimé`);

        await interaction.reply({ embeds: [embed3] });
      }
    }

    if (interaction.options.getSubcommand() === `preview`) {
      const data = await welcomeSchema.findOne({
        guildid: interaction.guild.id,
      });

      if (!data) {
        await interaction.reply({
          content: `Aucun message de bienvenue trouvé!`,
          ephemeral: true,
        });
      } else {
        const channel = client.channels.cache.get(data.channel);
        const message = data.message;

        const previewEmbed = new EmbedBuilder()
          .setColor(`#00FFFF`)
          .setTitle(`Prévisualisation du message de bienvenue`)
          .setDescription(
            message
              .replace("{mention}", interaction.user.toString())
              .replace("{user}", interaction.user.username)
              .replace("{servername}", interaction.guild.name)
              .replace("{totalmembers}", interaction.guild.memberCount)
          )
          .setTimestamp();

        await interaction.reply({ embeds: [previewEmbed], ephemeral: true });
      }
    }
  },
};
