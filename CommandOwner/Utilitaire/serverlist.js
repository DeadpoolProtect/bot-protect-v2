const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "serverlist",
  category: "Owner",
  description: "Displays a list of servers where the bot is present.",
  async execute(message, client, args) {
    const servers = Array.from(client.guilds.cache.values());
    const pageSize = 10;
    let currentPage = 0;

    const generateEmbed = (page) => {
      const start = page * pageSize;
      const end = start + pageSize;
      const serverList = servers.slice(start, end);

      const embed = new EmbedBuilder()
        .setTitle(`Server List - Page ${page + 1}`)
        .setColor("Blue")
        .setDescription(
          serverList
            .map((guild, index) => `${start + index + 1}. ${guild.name} (ID: ${guild.id})`)
            .join("\n")
        )
        .setFooter({ text: `Page ${page + 1} of ${Math.ceil(servers.length / pageSize)}` });

      return embed;
    };

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("prev")
          .setLabel("Previous")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === 0),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage >= Math.ceil(servers.length / pageSize) - 1)
      );

    const embedMessage = await message.channel.send({
      embeds: [generateEmbed(currentPage)],
      components: [buttons]
    });

    const collector = embedMessage.createMessageComponentCollector({ time: 60000 });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "prev" && currentPage > 0) {
        currentPage--;
      } else if (interaction.customId === "next" && currentPage < Math.ceil(servers.length / pageSize) - 1) {
        currentPage++;
      }

      await interaction.update({
        embeds: [generateEmbed(currentPage)],
        components: [
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId("prev")
                .setLabel("Previous")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === 0),
              new ButtonBuilder()
                .setCustomId("next")
                .setLabel("Next")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage >= Math.ceil(servers.length / pageSize) - 1)
            )
        ]
      });
    });

    collector.on("end", () => {
      embedMessage.edit({ components: [] });
    });
  }
};
