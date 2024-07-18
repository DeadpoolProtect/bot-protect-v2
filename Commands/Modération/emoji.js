const { SlashCommandBuilder } = require('@discordjs/builders');
const { default: axios } = require('axios');
const { EmbedBuilder, PermissionsBitField } = require('discord.js')
const UserColorSchema = require('../../Schema/UserColorSchema');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('emoji')
    .setDescription('Ajouter un emoji donné au serveur')
    .addStringOption(option => option.setName('emoji').setDescription('L\'emoji que vous souhaitez ajouter au serveur').setRequired(true))
    .addStringOption(option => option.setName('name').setDescription('Le nom de votre emoji').setRequired(true)),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "Vous devez être un administrateur et votre rôle doit disposer de l'autorisation **Administrateur** pour effectuer cette action.", ephemeral: true});
 
        let emoji = interaction.options.getString('emoji')?.trim();
        const name = interaction.options.getString('name');
 
        if (emoji.startsWith("<") && emoji.endsWith(">")) {
        const id = emoji.match(/\d{15,}/g)[0];
 
        const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
        .then(image => {
            if (image) return "gif"
            else return "png"
        }).catch(err => {
            return "png"
        })
 
            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
        }
 
        if (!emoji.startsWith("http")) {
            return await interaction.reply({ content: "Vous ne pouvez pas voler les emojis par défaut!", ephemeral: true})
        }
 
        if (!emoji.startsWith("https")) {
            return await interaction.reply({ content: "Vous ne pouvez pas voler les emojis par défaut!", ephemeral: true})
        }

        const guildId = interaction.guild.id;

        const userColorData = await UserColorSchema.findOne({ guildId });
        const embedColor = userColorData ? userColorData.color : 'Red';
 
        interaction.guild.emojis.create({ attachment: `${emoji}`, name: `${name}`})
        .then(emoji => {
            const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setDescription(`Ajouté ${emoji}, avec le nom ${name}`)
 
            return interaction.reply({ embeds: [embed] });
        }).catch(err => {
            interaction.reply({ content: "Vous ne pouvez pas ajouter cet emoji car vous avez atteint la limite d'emoji de votre serveur", ephemeral: true})
        })
    }
 
}