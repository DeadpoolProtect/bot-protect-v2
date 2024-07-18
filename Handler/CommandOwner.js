const { readdirSync } = require("fs");
const { REST, Routes } = require("discord.js");
const config = require("../config");
module.exports = (client) => {
  client.handleCommandsOwner = async () => {
    const commandFolders = readdirSync("./CommandOwner");
    for (const folder of commandFolders) {
      const commandFiles = readdirSync(`./CommandOwner/${folder}`).filter(
        (file) => file.endsWith(".js")
      );

      for (const file of commandFiles) {
        const command = require(`../CommandOwner/${folder}/${file}`);

        client.CommandOwner.set(command.name, command);
        delete require.cache[
          require.resolve(`../CommandOwner/${folder}/${file}`)
        ];
      }
    }
  }
};
