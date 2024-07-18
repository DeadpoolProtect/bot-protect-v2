const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hosting')
    .setDescription('Fait de la publicité pour l\'hébergement de bot Discord gratuit par KataBump'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Hébergement de Bot Discord GRATUIT par KataBump')
      .setDescription(`
**Dès aujourd'hui, profitez d'un hébergement de bot Discord GRATUIT !**

> KataBump propose une offre unique pour héberger votre bot discord NodeJs ou Python. Avec nos 384Go de RAM DDR4, KataBump est en mesure de vous fournir une qualité unique, malgré sa gratuité.

\`🛡️\`・250Mo de RAM DEDIÉE
\`🛡️\`・25% d'un coeur dédié à chaque hébergement
\`🛡️\`・Panel Pterodactyl
\`🛡️\`・Anti-DDOS de 1.3Tbps

Les conditions de l'offre gratuite :
> ➜ Posséder KataBump sur l'un de vos serveurs [Lien KataBump](https://discord.com/application-directory/1127907091324080218)
> ➜ Être sur le [Serveur Discord](https://discord.gg/GPmgappAXE)

Commandez dès maintenant votre serveur !
> ➜ [KataBump Hosting](https://katabump.com/host)

*KataBump est une association déclarée par la loi 1901.*
`)
      .setColor('Blue')
      .setFooter({ text: 'Profitez de notre offre dès aujourd\'hui !' });

    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
