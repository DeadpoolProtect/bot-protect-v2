const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Supprimer des messages dans le salon")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option =>
      option.setName("quantité")
        .setDescription("Le nombre de messages à supprimer")
        .setRequired(true)
    ),
  category: "Moderation",

  async execute(interaction, client) {
    const amount = interaction.options.getInteger("quantité");

    if (amount <= 0 || amount > 100) {
      return interaction.reply({ content: "Vous devez spécifier un nombre entre 1 et 100.", ephemeral: true });
    }

    try {
      const messages = await interaction.channel.messages.fetch({ limit: amount + 1 });

      const filteredMessages = messages.filter(msg => {
        const ageInDays = (Date.now() - msg.createdTimestamp) / (1000 * 60 * 60 * 24);
        return ageInDays <= 14;
      });
      
      const guildId = interaction.guild.id;

      const userColorData = await UserColorSchema.findOne({ guildId });
      const embedColor = userColorData ? userColorData.color : 'Red';

      await interaction.channel.bulkDelete(filteredMessages);

      const embed = new EmbedBuilder()
        .setTitle(`:wastebasket: ${filteredMessages.size} messages ont été supprimés`)
        .setColor(embedColor);
        
      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
      interaction.reply({ content: "Une erreur s'est produite lors de la suppression des messages.", ephemeral: true });
    }
  },
};
