const {
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const config = require("../../config");
const prefix = config.prefix;

module.exports = {
  name: "messageCreate",

  async execute(message, client) {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) return;

    if (config.Owners.includes(message.author.id)) {
      if (message.content.toLowerCase().startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = await client.CommandOwner.get(args.shift().toLowerCase());

        if (cmd) {
          return await cmd.execute(message, client, args);
        }
      }
    
    }
  },
};
