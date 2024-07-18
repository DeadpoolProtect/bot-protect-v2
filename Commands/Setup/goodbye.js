const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    PermissionFlagsBits,
  } = require("discord.js");
  const goodbyeSchema = require(`../../Schema/goodbyeSchema`);
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName(`goodbye`)
      .setDescription(`Configurer un message d'adieu`)
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addSubcommand((subcommand) =>
        subcommand
          .setName(`set`)
          .setDescription(`Mots clés = {mention}, {user}, {servername}, {totalmembers}`)
          .addChannelOption((option) =>
            option
              .setName(`channel`)
              .setDescription(`Le canal pour envoyer le message d'adieu`)
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName(`message`)
              .setDescription(`Configurer le message du goodbye`)
              .setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName(`remove`)
          .setDescription(`Supprime le système d'adieu`)
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName(`preview`)
          .setDescription(`Prévisualiser le message d'adieu`)
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
        const data = await goodbyeSchema.findOne({
          guildid: interaction.guild.id,
        });
  
        if (data) {
          const channel = interaction.options.getChannel(`channel`);
          const message = interaction.options.getString(`message`);
  
          await goodbyeSchema.findOneAndUpdate({
            guildid: interaction.guild.id,
            channel: channel.id,
            message: message,
          });
  
          await data.save();
  
          const embed1 = new EmbedBuilder()
            .setColor(`Blue`)
            .setTitle(`Système d'adieu`)
            .setDescription(
              `Le message d'adieu est mis à jour pour ${message} dans le canal ${channel}`
            )
            .setTimestamp();
  
          await interaction.reply({ embeds: [embed1] });
        }
  
        if (!data) {
          const channel = interaction.options.getChannel(`channel`);
          const message = interaction.options.getString(`message`);
          const data = await goodbyeSchema.create({
            guildid: interaction.guild.id,
            channel: channel.id,
            message: message,
          });
  
          await data.save();
  
          const embed = new EmbedBuilder()
            .setColor(`Blue`)
            .setTitle(`Système d'adieu`)
            .setDescription(
              `Le message d'adieu est défini sur "${message}" dans le canal ${channel}`
            )
            .setTimestamp();
  
          await interaction.reply({ embeds: [embed] });
        }
      }
  
      if (interaction.options.getSubcommand() === `remove`) {
        const data = await goodbyeSchema.findOne({
          guildid: interaction.guild.id,
        });
  
        if (!data) {
          await interaction.reply({
            content: `Aucun message d'adieu trouvé!`,
            ephemeral: true,
          });
        } else {
          await goodbyeSchema.findOneAndDelete({
            guildid: interaction.guild.id,
          });
  
          const embed3 = new EmbedBuilder()
            .setColor(`Blue`)
            .setTitle(`Système d'adieu`)
            .setDescription(`Message d'adieu supprimé`);
  
          await interaction.reply({ embeds: [embed3] });
        }
      }
  
      if (interaction.options.getSubcommand() === `preview`) {
        const data = await goodbyeSchema.findOne({
          guildid: interaction.guild.id,
        });
  
        if (!data) {
          await interaction.reply({
            content: `Aucun message d'adieu trouvé!`,
            ephemeral: true,
          });
        } else {
          const channel = client.channels.cache.get(data.channel);
          const message = data.message;
  
          const previewEmbed = new EmbedBuilder()
            .setColor(`Blue`)
            .setTitle(`Prévisualisation du message d'adieu`)
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
  