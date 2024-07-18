const { Events, EmbedBuilder, PermissionsBitField } = require('discord.js');
const AntimassmentionSchema = require('../../Schema/antimassmention');
const UserColorSchema = require('../../Schema/UserColorSchema');
const WhitelistSchema = require('../../Schema/setwlchema');
const OwnerSchema = require('../../Schema/setownerschema');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const guildId = message.guild.id;
    const userId = message.author.id;

    const antimassmentionSettings = await AntimassmentionSchema.findOne({ guildId });
    if (!antimassmentionSettings || !antimassmentionSettings.enabled) return;

    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    const isWhitelisted = await WhitelistSchema.findOne({ guildId, userId });
    if (isWhitelisted) return;

    const isOwner = await OwnerSchema.findOne({ guildId, userId });
    if (isOwner) return;

    const mentionLimit = antimassmentionSettings.mentionLimit;
    const timeoutDuration = antimassmentionSettings.timeoutDuration;
    const mentionsCount = message.mentions.users.size + message.mentions.roles.size;

    const userColorData = await UserColorSchema.findOne({ guildId });
    const embedColor = userColorData ? userColorData.color : 'Red';

    if (mentionsCount > mentionLimit) {
      await message.delete();

      await message.member.timeout(timeoutDuration * 1000, 'Mention excessive');

      const timeoutEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription(`${message.author}, vous avez été mis en timeout pendant ${timeoutDuration} secondes pour mention excessive.`);

      return message.channel.send({ embeds: [timeoutEmbed] });
    }
  },
};
