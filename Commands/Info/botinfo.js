const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ChannelType,
  } = require("discord.js");
  const UserColorSchema = require('../../Schema/UserColorSchema');

  const cpuStat = require("cpu-stat");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('botinfo')
      .setDescription('Obtenir des informations sur le bot'),
      
  
    async execute(interaction, client) {
      const { guild } = interaction;
      const { members } = guild;
      const days = Math.floor(client.uptime / 86400000);
      const hours = Math.floor(client.uptime / 3600000) % 24;
      const minutes = Math.floor(client.uptime / 60000) % 60;
      const seconds = Math.floor(client.uptime / 1000) % 60;
      const botCount = members.cache.filter(member => member.user.bot).size;
      const requestDate = new Date(interaction.createdTimestamp).toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });
      const totalBoosts = client.guilds.cache.reduce((a, b) => a + b.premiumSubscriptionCount, 0);
      const discordjsVersion = require("discord.js").version;

      const guildId = interaction.guild.id;

      const userColorData = await UserColorSchema.findOne({ guildId });
      const embedColor = userColorData ? userColorData.color : 'Red';
  
  
      cpuStat.usagePercent(function (error, percent) {
        if (error) return interaction.reply({ content: `${error}` });
  
        const memoryUsage = formatBytes(process.memoryUsage().heapUsed);
        const node = process.version;
        const cpu = percent.toFixed(2);
        const servers = client.guilds.cache.size;
        const users = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
  
        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setTitle("Information sur le bot JAD Protect")
          .addFields(
            { 
              name: "                   ", 
              value: `<:bot:1192790888263462953>・**Identité  du  bot**  \n > **Nom :** <@${client.user.id}> \n > \`${client.user.username}\` \n > **Identifiant :** ${client.user.id} \n > **Date de création :** <t:1704413280:f>`,
              inline: true 
            },
            { name: "<:groupe:1192912597314437311>・**Développeurs**", value: "> **Nom** : <@767412412731097108> \n > **@deadpool0430** \n >  **Identifiant** : \n > 767412412731097108 \n > **Date de création :** <t:1602980940:D> (<t:1602980940:R>) \n\n > **Nom :** <@394799572930789388> \n > **@ats_s** \n > **Identifiant :** 394799572930789388 \n > **Date de création :** <t:1514161920:f> (<t:1514161920:R>)", inline: true},
            { name: "<:server:1192789640877457478>・**Statistique du bot**", value: `> **Bot démarer depuis :** \`${days}j ${hours}h ${minutes}m ${seconds}s\` \n > **Serveurs :** ${servers} \n > **Utilisateurs :** ${users} \n >  **Robots :** ${botCount} \n > **Boosts :** ${totalBoosts} \n > **Ping :** ${client.ws.ping} ms \n > **Version :** Béta`, inline: false },
            { name: "<:settings:1192853210445127690>・**Information techniques**", value: `> **Hébergeur :** HebergeHub \n > **Utilisation du CPU :** ${cpu} % \n > **Node.js :** ${node} \n > **Discord.js :** v${discordjsVersion}`, inline:  false },
          )
          .setFooter({ text: `Demandé par ${interaction.user.username}`})
          .setTimestamp();
  
        interaction.reply({
          embeds: [embed],
        });
      });
        function formatBytes(a, b) {
            let c = 1024
            d = b || 2 
            e = ['B', 'KB', 'MB', 'GB', 'TB']
            f = Math.floor(Math.log(a) / Math.log(c))
  
            return parseFloat((a / Math.pow(c, f)).toFixed(d)) + '' + e[f]
        }
  
    }
  }