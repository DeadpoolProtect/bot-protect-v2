const { AuditLogEvent, Permissions, EmbedBuilder } = require('discord.js');
const ownerSchema = require('../../Schema/setownerschema');
const wlSchema = require('../../Schema/setwlchema');

module.exports = {
  name: 'channelCreate',
  async execute(channel) {
    if (!channel.guild) return;

    const guild = channel.guild;
    const guildId = guild.id;

    const auditLogs = await guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.ChannelCreate,
    });

    const creationLog = auditLogs.entries.first();
    if (!creationLog) return;

    const creator = creationLog.executor;

    if (!creator) return;

    const whitelistedUser = await wlSchema.findOne({ guildId, userId: creator.id });
    if (whitelistedUser) {
      return;
    }

    if (creator.id === guild.client.user.id) {
        return;
    }

    const guildOwner = await guild.fetchOwner();
    if (guildOwner.id === creator.id) {
      return; 
    }

    const ownerUser = await ownerSchema.findOne({ guildId, userId: creator.id });
    if (ownerUser) {
      return;
    }

    try {
      await guild.members.kick(creator.id, 'Création non autorisée d\'un canal');
    } catch (error) {
      console.error(`Erreur lors du kick de ${creator.tag}: ${error}`);
    }

    const logChannel = guild.systemChannel || guild.channels.cache.find(ch => ch.name === 'general');
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('Canal créé non autorisé')
        .setDescription(`Le canal \`${channel.name}\` a été créé par ${creator.tag}. L'utilisateur a été kické.`);
      
      logChannel.send({ embeds: [embed] });
    }

    if (guildOwner) {
      try {
        const ownerDM = await guildOwner.createDM();
        await ownerDM.send(`Un canal non autorisé a été créé par ${creator.tag}. L'utilisateur a été kické.`);
      } catch (error) {
        console.error(`Impossible d'envoyer un message privé à l'owner du serveur ${guild.name}: ${error}`);
      }
    }
    try {
        await channel.delete('Canal créé non autorisé');
      } catch (error) {
        console.error(`Erreur lors de la suppression du canal créé par ${creator.tag}: ${error}`);
      }
  },
};
