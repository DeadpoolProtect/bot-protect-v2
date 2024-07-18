const AntilinksSchema = require('../../Schema/antilinks');
const { Client, CommandInteraction, InteractionType, EmbedBuilder, Collection, PermissionFlagsBits } = require("discord.js");
const wl = require('../../Schema/setwlchema');
const owner = require('../../Schema/setownerschema')
const cooldowns = new Collection();
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    if (!newMessage.guild || !newMessage.author || newMessage.author.bot) return;

    const guildId = newMessage.guild.id;

    const whitelistedUser = await wl.findOne({ guildId, userId: newMessage.author.id });
    const OwnerUser = await owner.findOne({ guildId, userId: newMessage.author.id });
    const antilinksData = await AntilinksSchema.findOne({ guildId });

    if (!antilinksData || !antilinksData.active) return;

    if (newMessage.member.permissions.has(PermissionFlagsBits.Administrator) || whitelistedUser || OwnerUser) {
      return; 
    }

    if (oldMessage.content === newMessage.content) return;

    const whitelistLinks = antilinksData.whitelistLinks || [];
    const messageContent = newMessage.content.toLowerCase();
    const links = messageContent.match(/(https?:\/\/[^\s]+)/g) || [];

    const timeoutDuration = parseInt(antilinksData.time, 10);
    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red'; 

    for (const link of links) {
      if (!whitelistLinks.includes(link)) {
        newMessage.delete();

        setTimeout(() => {
          newMessage.member
            .timeout(timeoutDuration * 1000) 
            .catch(() => {});

          const timeoutEmbed = new EmbedBuilder()
            .setColor(embedColor)
            .setDescription(`${newMessage.author}, vous avez été timeout pendant ${timeoutDuration} secondes pour avoir envoyé un lien dans un message modifié.`);

          newMessage.channel.send({ embeds: [timeoutEmbed] });
        },); 
      }
    }

    return;
  },
};
