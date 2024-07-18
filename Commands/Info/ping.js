const {
      SlashCommandBuilder,
      EmbedBuilder,
      PermissionFlagsBits,
} = require("discord.js");

module.exports = {
      data: new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Voir la latence du bot.")
            .setDMPermission(false)
            .setDefaultMemberPermissions(null),
      category: "Core",
      cooldown: 10,
      async execute(interaction, client) {


            interaction.reply({ content: `La latence de l'API est de **${client.ws.ping}ms**`, ephemeral: true })
      },
};
