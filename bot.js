require("dotenv").config();
const client = require("./Client/DiscordJS");
const { Collection, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
client.login();

["events", "slashCommand", "CommandOwner"].forEach(
  (collectionName) => (client[collectionName] = new Collection())
);

["EventClient", "SlashCommand", "CommandOwner"].forEach((x) =>
  require(`./Handler/${x}`)(client)
);

client.handleEvents();


mongoose.connect(process.env.mongodb);


process.on("unhandledRejection", (err, promise) => {
  console.log("[ANTICRASH] :: [unhandledRejection]");
  console.log(promise, err);
  console.log("[ANTICRASH] :: [unhandledRejection] END");
});
process.on("uncaughtException", (err, origin) => {
  console.log("[ANTICRASH] :: [uncaughtException]");
  console.log(err, origin);
  console.log("[ANTICRASH] :: [uncaughtException] END");
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log("[ANTICRASH] :: [uncaughtExceptionMonitor]");
  console.log(err, origin);
  console.log("[ANTICRASH] :: [uncaughtExceptionMonitor] END");
});