const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  command: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Displays the bots latency with a refresh button'),

  callback : async (interaction) => {
    const ping = Date.now() - interaction.createdTimestamp;
    const apiPing = Math.round(interaction.client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('Pluh !')
      .addFields(
        { name: 'Bot Latency', value: `${ping}ms`, inline: true },
        { name: 'API Latency', value: `${apiPing}ms`, inline: true }
      );

    const refreshButton = new ButtonBuilder()
      .setCustomId('refresh_ping')
      .setLabel('Refresh')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
    .addComponents(refreshButton);

    await interaction.reply({ embeds: [embed], components: [row] });

    const filter = i => i.customId === 'refresh_ping' && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter });

    collector.on('collect', async i => {
      if (i.customId === 'refresh_ping') {
        const newPing = Date.now() - i.createdTimestamp;
        const newApiPing = Math.round(interaction.client.ws.ping);

        const newEmbed = new EmbedBuilder()
          .setColor('Blue')
          .setTitle(':ping_pong: Pong!')
          .addFields(
            { name: 'Bot Latency', value: `${newPing}ms`, inline: true },
            { name: 'API Latency', value: `${newApiPing}ms`, inline: true }
          );

        await i.update({ embeds: [newEmbed], components: [row] });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({ components: [] });
      }
    });
  }
};