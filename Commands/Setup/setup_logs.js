const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const LogsSchema = require('../../Schema/LogsSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup_logs')
    .setDescription('Créer une catégorie de salons pour les logs.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const guild = interaction.guild;

    const existingCategory = guild.channels.cache.find(
      (ch) => ch.type === ChannelType.GuildCategory && ch.name === '📁・Espace logs'
    );

    if (existingCategory) {
      return interaction.reply({
        content: 'La catégorie de logs existe déjà.',
        ephemeral: true,
      });
    }

    const logsCategory = await guild.channels.create({
      name: '📁・Espace logs',
      type: ChannelType.GuildCategory,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel],
        },
      ],
    });

    const logsChannels = [
      '📁・logs-message',
      '📁・logs-vocal',
      '📁・logs-boost',
      '📁・logs-roles',
      '📁・logs-ban',
      '📁・logs-channel',
    ];

    const createdChannels = {};

    for (const channelName of logsChannels) {
      const createdChannel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: logsCategory.id,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: [PermissionFlagsBits.ViewChannel],
          },
        ],
      });

      createdChannels[channelName] = createdChannel.id;
    }

    const newLogsSchema = new LogsSchema({
      guildId: guild.id,
      categoryName: logsCategory.name,
      logsChannels: new Map(Object.entries(createdChannels)),
    });

    await newLogsSchema.save();

    await interaction.reply({
      content: 'La catégorie de logs et les salons ont été créés avec succès.',
      ephemeral: true,
    });
  },
};
