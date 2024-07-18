const {
    ChatInputCommandInteraction,
    EmbedBuilder,
    ChannelType,
    GuildVerificationLevel,
    GuildExplicitContentFilter,
    GuildNSFWLevel,
    SlashCommandBuilder,
    GuildEmoji,
    GuildEmojiRoleManager,
    RoleManager
  } = require("discord.js");
  const UserColorSchema = require('../../Schema/UserColorSchema');

  module.exports = {
    data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Affiche des informations sur le serveur."),
    /**    
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guild } = interaction;
        const {
            members,
            channels,
            emojis,
            roles,
            stickers
        } = guild;

        const guildId = interaction.guild.id;

        const userColorData = await UserColorSchema.findOne({ guildId });
        const embedColor = userColorData ? userColorData.color : 'Red';
        
        const sortedRoles  = roles.cache.map(role => role).slice(1, roles.cache.size).sort((a, b) => b.position - a.position);
        const userRoles    = sortedRoles.filter(role => !role.managed);
        const managedRoles = sortedRoles.filter(role => role.managed);
        const botCount     = members.cache.filter(member => member.user.bot).size;
        const isPartnered = guild.features.includes("PARTNERED");
        const isVerified = guild.features.includes("VERIFIED");
        const animatedEmojis = emojis.cache.filter(emoji => emoji.animated);
        const nonAnimatedEmojis = emojis.cache.filter(emoji => !emoji.animated);
        const totalMembers = members.cache.size;
        const totalBotMembers = (await guild.members.fetch()).filter(member => member.user.bot).size;
        const totalUserMembers = totalMembers - totalBotMembers;
  
        const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
            let totalLength = 0;
            const result = [];
  
            for (const role of roles) {
                const roleString = `<@&${role.id}>`;
  
                if (roleString.length + totalLength > maxFieldLength)
                    break;
  
                totalLength += roleString.length + 1; // +1 as it's likely we want to display them with a space between each role, which counts towards the limit.
                result.push(roleString);
            }
  
            return result.length;
        }
  
        const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator);
        const toPascalCase = (string, separator = false) => {
            const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
            return separator ? splitPascal(pascal, separator) : pascal;
        };
  
        const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;
        const totalTextChannels = getChannelTypeSize([ChannelType.GuildText]);
        const totalvocal = getChannelTypeSize([ChannelType.GuildVoice]);
        const totalcategorie = getChannelTypeSize([ChannelType.GuildCategory]);
        const totalBoosts = guild.premiumSubscriptionCount || 0;
  
        const convertVerificationLevel = level => {
          switch (level) {
            case GuildVerificationLevel.NONE:
              return "Aucun";
            case GuildVerificationLevel.LOW:
              return "Bas";
            case GuildVerificationLevel.MEDIUM:
              return "Moyen";
            case GuildVerificationLevel.HIGH:
              return "Haut";
            case GuildVerificationLevel.VERY_HIGH:
              return "Très haut";
            default:
              return "Inconnu";
          }
        };
  
        interaction.reply({ embeds: [
            new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(`Information sur le serveur ${guild.name}`)
                .setThumbnail(guild.iconURL({ size: 1024 }))
                .setImage(guild.bannerURL({ size: 1024 }))
                .addFields(
                  { name: "<:settings:1192853210445127690>・**Informations principal :**", value: `** Nom du serveur :** ${guild.name} \n **ID :** ${guild.id} \n **Owner :** <@${interaction.guild.ownerId}> \n **Date de création :** <t:${Math.floor(guild.createdTimestamp / 1000)}:F> \n **Salon AFK :** ${guild.afkChannel} \n **AFK Timeout :** ${guild.afkTimeout} sec`, inline: true},
                  { name: "<:badge_responsable:1192915280809173086>・**Badges discord :**", value: `> **Partenaire discord :** ${isPartnered ? '<:yes:1192895015534465146>・Oui' : '<:no:1192895016696283288>・Non'} \n > **Discord Vérifié :** ${isVerified ? '<:yes:1192895015534465146>・Oui' : '<:no:1192895016696283288>・Non'}`, inline: true},
                  {
                      name: "<:shield_mod:1192917428989075606>・**Information sécurité :**",
                      value: `> **Niveau de vérification :** ${convertVerificationLevel(guild.verificationLevel)} \n > **Filtre explicite :** ${guild.explicitContentFilter} \n > **Niveau NSFW :** ${guild.nsfwLevel}`,
                      inline: true
                  },
                  { name: "<:groupe:1192912597314437311>・**Statistique**", value: `> **Nombre d'émoji(s) :** ${emojis.cache.size}   \n > **Nombre d'émoji(s) animé :** ${animatedEmojis.size} \n > **Nombre d'émoji(s) non-animé :** ${nonAnimatedEmojis.size} \n > **Nombre de membre :** ${guild.memberCount} \n > **Nombre d'utilisateur :** ${members.cache.size} \n > **Nombre de bots :** ${totalBotMembers} \n > **Nombre de rôle :** ${roles.cache.size} \n > **Salon textuel :** ${totalTextChannels} \n > **Salon vocaux :** ${totalvocal} \n > **Catégorie :** ${totalcategorie} \n > **Nombre de boost :** ${totalBoosts}`, inline: false}
              )
        ], ephemeral: false });
    }
  }