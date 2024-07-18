const { AuditLogEvent, EmbedBuilder } = require('discord.js');
const wl = require('../../Schema/setwlchema');
const ownere = require('../../Schema/setownerschema')

module.exports = {
  name: 'channelDelete',
  async execute(channel) {
    if (!channel.guild) return;

    const guild = channel.guild;
    const guildId = guild.id;

    const auditLogs = await guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.ChannelDelete,
    });

    const deletionLog = auditLogs.entries.first();
    if (!deletionLog) return;

    const executor = deletionLog.executor;
    if (!executor) return;

    const whitelistedUser = await wl.findOne({ guildId, userId: executor.id });
    if (whitelistedUser) return;

    if (executor.id === guild.client.user.id) {
      return; 
    }

    const guildOwner = await guild.fetchOwner();
    if (guildOwner.id === executor.id) {
      return; 
    }
    
    const owneruser = await ownere.findOne({ guildId, userId: executor.id });
    if (owneruser) return;


    await guild.members.kick(executor.id, 'Suppression non autorisée d\'un canal');

    const newChannel = await guild.channels.create({
      name: channel.name,
      type: channel.type,
      position: channel.position,
      parent: channel.parent,
      topic: channel.topic,
      permissionOverwrites: channel.permissionOverwrites.cache.map(perm => perm.toJSON()),
    });

    const logChannel = guild.systemChannel || guild.channels.cache.find(ch => ch.name === 'general');
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('Canal supprimé')
        .setDescription(`Le canal ${channel.name} a été supprimé par ${executor.tag}. Le canal a été recréé et l'utilisateur a été kické.`);

      logChannel.send({ embeds: [embed] });
    }

    const owner = await guild.fetchOwner();
    if (owner) {
      try {
        const ownerDM = await owner.createDM();
        await ownerDM.send(`Un canal a été supprimé dans votre serveur \`${guild.name}\` par ${executor.tag}.`);
      } catch (error) {
        console.error(`Impossible d'envoyer un message privé à l'owner du serveur ${guild.name}: ${error}`);
      }
    }
  },
};
