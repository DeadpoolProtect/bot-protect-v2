const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
  } = require("discord.js");
  const UserColorSchema = require('../../Schema/UserColorSchema');
  
  const wait = require('node:timers/promises').setTimeout;
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('hack')
      .setDescription('Piratez l\'utilisateur mentionné. "C\'est faux, donc pas de soucis."')
      .addUserOption(option => option
        .setName('user')
        .setDescription('L\'utilisateur mentionné sera piraté.')
        .setRequired(true)
      ),
    async execute(interaction) {
      const target = await interaction.options.getUser('user');
      if (!target) return await interaction.reply({ content: '**Qui vas-tu pirater ? Tu vas pirater l\'air ? Mentionne un utilisateur !**' });
  
      await interaction.reply({ content: `Lancement du processus de piratage de ${target}..` });
      await wait(2500);
      await interaction.editReply({ content: `Préparation du processus en cours..` });
      await wait(2500);
      await interaction.editReply({ content: `Installation de l'application sur les appareils de ${target}..` });
      await wait(2500);
      await interaction.editReply({ content: `Récupération du mot de passe et de l'identifiant des appareils de ${target}..` });
      await wait(2500);
      await interaction.editReply({ content: `Vol de la carte de crédit de la mère de ${target}..` });
      await wait(2500);
      await interaction.editReply({ content: `Piratage de l'ordinateur et du Wi-Fi de ${target}..` });
      await wait(2500);
      await interaction.editReply({ content: `Récupération de la localisation, du nom, des mots de passe et des informations personnelles de ${target}..` });
      await wait(2500);
      await interaction.editReply({ content: `Exposition des informations personnelles, de la carte de crédit de la mère et du Wi-Fi de ${target}..'` });
      await wait(3000);
      await interaction.editReply({ content: `Mission accomplie ! J'ai réussi à pirater les appareils de ${target}` });
  
      const button = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Télécharger")
        .setURL("https://www.youtube.com/watch?v=BBJa32lCaaY");
  
      const actionRow = new ActionRowBuilder().addComponents(button);

      const guildId = interaction.guild.id;

      const userColorData = await UserColorSchema.findOne({ guildId });
      const embedColor = userColorData ? userColorData.color : 'Red';
  
      const embed = new EmbedBuilder()
        .setTitle("🔒 │ Piratage terminé")
        .setDescription(`Le piratage de ${target} a été réalisé avec succès !`)
        .setColor("Blue");
  
      await interaction.editReply({
        embeds: [embed],
        components: [actionRow],
      });
    },
  };
  