const axios = require("axios");
const querystring = require("querystring");
const { ActivityType } = require("discord.js");
module.exports = {
      name: "ready",
      async execute(client) {
            console.log(`${client.user.username} est prêt !`)

            client.handleCommands()

      }
}