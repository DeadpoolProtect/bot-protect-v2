const {
  Client,
  CommandInteraction,
  InteractionType,
  EmbedBuilder,
  Collection,
  PermissionsBitField,
  User,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    if (interaction.type === InteractionType.ApplicationCommand) {
      const cmd = client.slashCommand.get(interaction.commandName);
      if (!cmd) return;
      cmd.execute(interaction, client);
    }
  },
};
