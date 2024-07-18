const AntilinksSchema = require('../../Schema/antilinks');
const { Client, CommandInteraction, InteractionType, EmbedBuilder, Collection, PermissionFlagsBits } = require("discord.js");
const wl = require('../../Schema/setwlchema');
const owner = require('../../Schema/setownerschema')
const cooldowns = new Collection();
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (!message.guild || !message.member || message.member.user.bot) return;

    const guildId = message.guild.id;

    const whitelistedUser = await wl.findOne({ guildId, userId: message.member.user.id });
    const OwnerUser = await owner.findOne({ guildId, userId: message.author.id });
    const isAdministrator = message.member.permissions.has(PermissionFlagsBits.Administrator) || whitelistedUser || OwnerUser;

    if (isAdministrator) {
      return; 
    }

    const antilinksData = await AntilinksSchema.findOne({ guildId });
    if (!antilinksData || !antilinksData.active) {
      return;
    }

    const whitelistLinks = antilinksData.whitelistLinks || [];
    const allowGif = antilinksData.allowGif;
    const linkSource = antilinksData.linkSource;
    const timeoutDuration = parseInt(antilinksData.time, 10);

    const messageContent = message.content.toLowerCase();
    const links = messageContent.match(/(https?:\/\/[^\s]+)/g) || messageContent.match(/(https?:\/\/[^\s]+|discord\.gg\/[^\s]+)/g) || [];

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    for (const link of links) {
      if (linkSource && (message.member.user.bot || message.webhookId) && !whitelistLinks.includes(link)) {
        message.delete();
        const userId = message.member.user.id;
        cooldowns.set(userId, true);
        setTimeout(() => cooldowns.delete(userId), 5000);
        return;
      }

      if (link.includes('discord.gg/') && !isAdministrator) {
        message.delete();

        setTimeout(() => {
          message.member
            .timeout(timeoutDuration * 1000)
            .catch(() => {});

          const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setDescription(`${message.member}, vous avez été timeout pendant ${timeoutDuration} secondes pour avoir envoyé un lien Discord interdit.`);

          message.channel.send({ embeds: [embed] });
        },);

        return;
      }

      if (
        !whitelistLinks.includes(link) &&
        !(
          (allowGif && link.startsWith('https://tenor.com/')) ||
          (allowGif && link.startsWith('https://media.discordapp.net/'))
        )
      ) {
        message.delete();

        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setDescription(`${message.member}, le lien n'est pas autorisé dans ce serveur.`);

        message.channel.send({ embeds: [embed] });
      }
    }
  },
};
