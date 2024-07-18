const { readdirSync } = require("fs");
const { REST, Routes } = require("discord.js");
require("dotenv").config();

let = slashCommandArray = [];
const commandFolders = readdirSync("./Commands");
for (const folder of commandFolders) {
  const commandFiles = readdirSync(`./Commands/${folder}`).filter((file) =>
    file.endsWith(".js")
  );

  for (const file of commandFiles) {
    const command = require(`./Commands/${folder}/${file}`);
    if (!command.maintenance) {
      slashCommandArray.push(command.data.toJSON());
    }
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.Token);

rest
  .put(Routes.applicationCommands(process.env.ClientID), {
    body: slashCommandArray,
  })
  .then((data) =>
    console.log(`Successfully registered ${data.length} application commands.`)
  )
  .catch(console.error);
