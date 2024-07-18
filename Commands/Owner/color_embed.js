const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('color_embed')
    .setDescription('Choisi la couleur de l\'embed.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("La couelur de l'embed.")
        .setRequired(true)
        .addChoices(
          { name: "aqua", value: "#00FFFF" },
          { name: "blurple", value: "#7289DA" },
          { name: "fuchsia", value: "#FF00FF" },
          { name: "gold", value: "#FFD700" },
          { name: "green", value: "#008000" },
          { name: "gray", value: "#808080" },
          { name: "slategray", value: "#7D7F9A" },
          { name: "lightgray", value: "#D3D3D3" },
          { name: "hotpink", value: "#FF007F" },
          { name: "navy", value: "#000080" },
          { name: "not-quite-black", value: "#232323" },
          { name: "orange", value: "#FFA500" },
          { name: "purple", value: "#800080" },
          { name: "red", value: "#FF0000" },
          { name: "white", value: "#FFFFFF" },
          { name: "yellow", value: "#FFFF00" },
          { name: "blue", value: "#0000FF" },
        )),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const chosenColor = interaction.options.getString('color');

    try {
        await UserColorSchema.findOneAndUpdate(
          { guildId },
          { color: chosenColor },
          { upsert: true }
        );
  
        const embed = new EmbedBuilder()
          .setTitle('La couleur de l\'embed a bien été modifiée.')
          .setDescription(`La couleur de l'embed a été mise à jour avec succès. Couleur choisie : ${chosenColor}`)
          .setColor(chosenColor);
  
        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la couleur de l\'embed :', error);
        await interaction.reply('Une erreur est survenue lors de la mise à jour de la couleur de l\'embed.');
      }
    },
  };