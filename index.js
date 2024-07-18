const { ShardingManager, ShardEvents } = require("discord.js");
require("dotenv").config();

const manager = new ShardingManager("./bot.js", {
  token: process.env.Token,
  shardList: "auto",
  respawn: true,
  autoSpawn: true,
  totalShards: "auto",
});

manager.on("shardCreate", (shard) => {
  shard
    .on(ShardEvents.Ready, () => {
      console.log(`Shard ${shard.id} connecté.`, "client");
    })
    .on(ShardEvents.Disconnect, () => {
      console.log(`Shard ${shard.id} déconnecté.`, "client");
    })
    .on(ShardEvents.Reconnecting, () => {
      console.log(`Shard ${shard.id} reconnection.`, "client");
    })
    .on(ShardEvents.Error, (error) => {
      console.log(
        `Shard ${shard.id} a rencontré une erreur: ${error.message}`,
        "client"
      );
    })
    .on(ShardEvents.Death, () => {
      console.log(`Shard ${shard.id} est mort.`, "client");
    });
});

manager
  .spawn({ amount: manager.totalShards, delay: null, timeout: -1 })
  .then(async (shards) => {
    console.log(`${shards.size} Shard(s) actif(s).`, "client");
  })
  .catch((err) => {
    return console.log(`Une erreur s'est produite :\n${err}`, "error");
  });


module.exports = manager;
