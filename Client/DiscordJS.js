const { Client, GatewayIntentBits, Partials, Options } = require("discord.js");
const client = new Client({
  intents: require("./config").intents,
  partials: require("./config").partials,
});

// https://discord-intents.jmx94.fr/

module.exports = client;
