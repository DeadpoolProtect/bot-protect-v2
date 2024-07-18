const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const BlacklistSchema = require("../../Schema/blacklist");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blacklist")
        .setDescription("Blacklist a member with a reason.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addUserOption(option => 
            option
                .setName("member")
                .setDescription("Member to blacklist.")
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName("reason")
                .setDescription("Reason for blacklisting the member.")
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const user = interaction.options.getUser("member");
        const reason = interaction.options.getString("reason");

        if (interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({ content: ":x: Vous n'avez pas les permissions de utiliser cette commande !", ephemeral: true });
        }

        try {
            const findDB = await BlacklistSchema.findOne({ guildId: interaction.guild.id, userId: user.id });

            if (findDB) {
                return interaction.reply({ content: ":x: Le membre est déjà dans la liste noire !", ephemeral: true });
            }

            await BlacklistSchema.create({
                guildId: interaction.guild.id,
                userId: user.id,
                reason: reason,
            });

            return interaction.reply({ content: `Le membre ${user.tag} a été ajouté à la liste noire pour la raison suivante : ${reason}`, ephemeral: true });

        } catch (err) {
            console.error(err);
            return interaction.reply({ content: ":x: Une erreur s'est produite lors de l'ajout du membre à la liste noire.", ephemeral: true });
        }
    }
};
