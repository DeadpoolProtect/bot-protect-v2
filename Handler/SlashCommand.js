const { readdirSync } = require("fs");
const { REST, Routes } = require("discord.js");
module.exports = (client) => {
  let = slashCommandArray = [];

  client.handleCommands = async () => {
    const commandFolders = readdirSync("./Commands");
    for (const folder of commandFolders) {
      const commandFiles = readdirSync(`./Commands/${folder}`).filter((file) =>
        file.endsWith(".js")
      );

      for (const file of commandFiles) {
        const command = require(`../Commands/${folder}/${file}`);
        if (!command.maintenance) {
          await slashCommandArray.push(command.data.toJSON());

          await client.slashCommand.set(command.data.name, command);
        }
      }
    }

    const rest = new REST({ version: "10" }).setToken(client.token);

    (async () => {
      try {
        await rest.put(Routes.applicationCommands(client.user.id), {
          body: slashCommandArray,
        });
      } catch (error) {
        console.error(error)
      }
    })();
  };
};
