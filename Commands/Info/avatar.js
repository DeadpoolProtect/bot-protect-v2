const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require(`discord.js`);
const UserColorSchema = require('../../Schema/UserColorSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`avatar`)
    .setDescription(`Affiche l'avatar de l'utilisateur.`)
    .addUserOption(option => option.setName(`user`).setDescription(`L'utilisateur que vous voulez`).setRequired(false)),
    async execute (interaction, client) {
        const usermention = interaction.options.getUser(`user`) || interaction.user;
        let banner = await (await client.users.fetch(usermention.id, { force: true })).bannerURL({ dynamic: true, size: 4096 });

        const cmp = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel(`Avatar`)
            .setCustomId(`avatar`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
            .setLabel(`Bannier`)
            .setCustomId(`banner`)
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setLabel(`Delete`)
            .setCustomId(`delete`)
            .setStyle(ButtonStyle.Danger)
        )

        const cmp2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel(`Avatar`)
            .setCustomId(`avatar`)
            .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
            .setLabel(`Banner`)
            .setCustomId(`banner`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setLabel(`Supprimer`)
            .setCustomId(`delete`)
            .setStyle(ButtonStyle.Danger)
        )

        const guildId = interaction.guild.id;

        const userColorData = await UserColorSchema.findOne({ guildId });
        const embedColor = userColorData ? userColorData.color : 'Red';

        const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setAuthor({ name: `${usermention.tag}`, iconURL: `${usermention.displayAvatarURL({ dynamic: true, size: 512 })}`})
        .setTitle(`Download`)
        .setURL(usermention.displayAvatarURL({ size: 1024, format: `png`, dynamic: true}))
        .setImage(usermention.displayAvatarURL({ size: 1024, format: "png", dynamic: true }))

        const embed2 = new EmbedBuilder()
        .setColor(embedColor)
        .setAuthor({ name: `${usermention.tag}`, iconURL: `${usermention.displayAvatarURL({ dynamic: true, size: 512 })}`})
        .setDescription(banner ? " " : "L'utilisateur n'a pas de bannière.")
        .setTitle(`Download`)
        .setURL(banner)
        .setImage(banner)

        const message = await interaction.reply({ embeds: [embed], components: [cmp] });
        const collector = await message.createMessageComponentCollector();

        collector.on(`collect`, async c => {
      
            if (c.customId === 'avatar') {
              
              if (c.user.id !== interaction.user.id) {
                return await c.reply({ content: `Seulement ${interaction.user.tag} peut interagir avec les boutons!`, ephemeral: true})
              }
              
              await c.update({ embeds: [embed], components: [cmp]})
            }

            if (c.customId === 'banner') {
              
              if (c.user.id !== interaction.user.id) {
                return await c.reply({ content: `Seulement ${interaction.user.tag} peut interagir avec les boutons!`, ephemeral: true})
              }
                
              await c.update({ embeds: [embed2], components: [cmp2]})
            }

            if (c.customId === 'delete') {
              
              if (c.user.id !== interaction.user.id) {
                return await c.reply({ content: `Seulement ${interaction.user.tag} peut interagir avec les boutons!`, ephemeral: true})
              }
              
              interaction.deleteReply();
            }
          })
    }
}