const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")
const schema = require("../../Schema/setownerschema")
module.exports = {
      data: new SlashCommandBuilder()
            .setName("setowner")
            .setDescription("Définir un owner.")
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .setDMPermission(false)
            .addUserOption((x) => x.setName("membre").setDescription("Membre à définir.").setRequired(true)),
      async execute(interaction, client) {

            let user = interaction.options.getUser("membre")
            if (interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ content: ":x: Vous n'avez pas les permissions de utiliser cette commande !", ephemeral: true })

            let findDB = await schema.findOne({ guildId: interaction.guild.id, userId: user.id });

            if (findDB) return interaction.reply({ content: ":x: Le membre est déjà présent dans la liste !", ephemeral: true })


            schema.create({
                  guildId: interaction.guild.id,
                  userId: user.id
            }).then(() => {
                  return interaction.reply({ content: "Le membre a été ajouté dans la liste !", ephemeral: true })
            }).catch((err) => {
                  return interaction.reply({ content: err })
            })


      }
}