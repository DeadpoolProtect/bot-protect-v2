const { Client, EmbedBuilder, Collection } = require('discord.js');
const AntiGhostPingSchema = require('../../Schema/antighostping');
const { PermissionFlagsBits } = require('discord.js');
const cooldowns = new Collection();
const UserColorSchema = require('../../Schema/UserColorSchema');
const wl = require('../../Schema/setwlchema');
const owner = require('../../Schema/setownerschema')

module.exports = {
  name: 'messageDelete',
  async execute(message) {
    if (!message || !message.guild || !message.mentions || !message.author || message.author.bot) return;

    const guildId = message.guild.id;
    const antiGhostPingData = await AntiGhostPingSchema.findOne({ guildId });

    if (!antiGhostPingData || !antiGhostPingData.active) return;

    const whitelistedUser = await wl.findOne({ guildId, userId: message.author.id });
    const OwnerUser = await owner.findOne({ guildId, userId: message.author.id });

    if (whitelistedUser) {
      return;
    }

    if (OwnerUser) {
      return;
    }     

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    const mentionedMembers = message.mentions.members.filter(member => !member.user.bot && member.id !== message.author.id);

    if (mentionedMembers.size > 0 && !cooldowns.has(message.author.id)) {
      const ghostPingEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('Anti Ghost Ping')
        .setDescription(`Les ghost pings ne sont pas autorisés dans ce serveur.\nAuteur du message : ${message.author}`)
        .addFields({ name: 'Contenu du message', value: message.content });


      if (message.member.moderatable) {
        await message.member
         .timeout(5000, "AntiGoshtPing - Interdir les GhostPing")
         .then(() => {
           message.channel.send({ embeds: [ghostPingEmbed] }).catch(() => {})
         });
        }

      cooldowns.set(message.author.id, true);
      setTimeout(() => cooldowns.delete(message.author.id), 5000);
    }
  },
};
