const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Affiche les informations d'un utilisateur.")
    .addUserOption((option) =>
      option.setName("utilisateur")
        .setDescription("L'utilisateur dont vous souhaitez afficher les informations.")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const targetUser = interaction.options.getUser("utilisateur") || interaction.user;
    if (!interaction.guild.members.cache.has(targetUser.id)) {
      return interaction.reply("Cet utilisateur n'est pas présent dans ce serveur.");
    }
    const member = await interaction.guild.members.fetch(targetUser.id);
    const topRole = member.roles.highest;
    const banner = await (await client.users.fetch(targetUser.id, { force: true })).bannerURL({ size: 4096 });

    const formattedJoinDate = new Date(member.joinedTimestamp).toLocaleString("fr-FR", {
      dateStyle: "long",
      timeStyle: "long",
    });
    const formattedCreationDate = new Date(targetUser.createdTimestamp).toLocaleString("fr-FR", {
      dateStyle: "long",
      timeStyle: "long",
    });

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        { name: "<:people:1192892928700448838>・**Identifiant :**", value: `\`${member.user.id}\``, inline: true },
        { name: "<:people:1192892928700448838>・**Pseudonyme :**", value: `\`@${member.user.username}\``, inline: true },
        { name: "<:mic:1195855245251719280> ・**Date de création :**", value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>`, inline: true },
        { name: "<:bot:1192894309696024710>・**Bot :**", value: member.user.bot ? "<:yes:1192895015534465146>・Oui" : "<:no:1192895016696283288>・Non", inline: false },
        { name: "                   ", value: "<:search:1192895513679368253>・**Information relative au serveur :**", inline: true },
        { name: "<:crown:1192901506169569320>・**Plus haut rôle :**", value: `\`${topRole.name}\``, inline: false },
        { name: "<:link:1192905859014082623>・**Rôles :**", value: member.roles.cache.map(role => `${role.name}`).join(', '), inline: true },
        { name: "<:mic:1200890945395249172>・**Date d'arrivée :**", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true }
      )
      .setImage(banner)
      .setTimestamp();



    if (member.user.banner) {
      embed.setImage(member.user.bannerURL({ format: "png", size: 4096 }));
    }

    if (member.premiumSince) {
      embed.addFields({ name: "Booster", value: "<:yes:1192895015534465146>・Oui" });
    } else {
      embed.addFields({ name: "Booster", value: "<:no:1192895016696283288>・Non" });
    }

    if (member.user.id === "767412412731097108") {
      embed.addFields({ name: "<:DiscordEmployee:1192911004472983713>・**Badges :**", value: "> <:DevelopperBot:1192912217578930257>・**Développeur et Propriétaire** de HessCrow \n > <:people:1192892928700448838>・**Propriétaire** de HessCrow \n > <:capadmin:1192913252473114625>・**Administrateur** de HessCrow \n > <:badge_responsable:1192915280809173086>・**Reesponsables** de HessCrow \n > <:shield_mod:1192917428989075606>・**Modérateurs** de HessCrow \n > <:book_sup:1192917195890622625>・**Supports** de HessCrow \n > <:staff:1192917592181051512>・**Staff** de HessCrow \n > <:bug_hunter:1192918889865166999>・**Bugs hunter** de HessCrow"});
    }

    if (member.user.id === "394799572930789388") {
      embed.addFields({ name: "<:DiscordEmployee:1192911004472983713>・**Badges :**", value: "> <:DevelopperBot:1192912217578930257>・**Développeur et Propriétaire** de HessCrow \n > <:people:1192892928700448838>・**Propriétaire** de HessCrow \n > <:capadmin:1192913252473114625>・**Administrateur** de HessCrow \n > <:badge_responsable:1192915280809173086>・**Reesponsables** de HessCrow \n > <:shield_mod:1192917428989075606>・**Modérateurs** de HessCrow \n > <:book_sup:1192917195890622625>・**Supports** de HessCrow \n > <:staff:1192917592181051512>・**Staff** de HessCrow \n > <:bug_hunter:1192918889865166999>・**Bugs hunter** de HessCrow"});
    }

    if (member.user.id === "943086186644258886") {
      embed.addFields({ name: "<:DiscordEmployee:1192911004472983713>・**Badges :**", value: "> <:DevelopperBot:1192912217578930257>・**Développeur et Propriétaire** de HessCrow \n > <:people:1192892928700448838>・**Propriétaire** de HessCrow \n > <:capadmin:1192913252473114625>・**Administrateur** de HessCrow \n > <:badge_responsable:1192915280809173086>・**Reesponsables** de HessCrow \n > <:shield_mod:1192917428989075606>・**Modérateurs** de HessCrow \n > <:book_sup:1192917195890622625>・**Supports** de HessCrow \n > <:staff:1192917592181051512>・**Staff** de HessCrow \n > <:bug_hunter:1192918889865166999>・**Bugs hunter** de HessCrow"});
    }

    if (member.user.id === "1047224150411968573") {
      embed.addFields({ name: "<:DiscordEmployee:1192911004472983713>・**Badges :**", value: "> <:staff:1192916319822155977>・**Amis**"});
    }
    
    interaction.reply({ embeds: [embed] });
  },
};
