import { EmbedBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandUserOption,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("confession")
  .setDescription("CONFESSION ANONYME")
  .setDefaultMemberPermissions(null)
  .setDMPermission(false)
  .addStringOption(
    new SlashCommandStringOption().setName("confession").setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  let confession = interaction.options.get("confession")?.value as string;
  let channel = interaction.channel;

  let embed = new EmbedBuilder()
    .setTitle("Confession Anonyme")
    .setColor(0x5e9cff)
    .addFields({name: 'Confession :', value : confession})
    .setTimestamp()
    .setFooter({ text: "Fait avec la commande /confession" });

  await channel?.send({ embeds: [embed] });
  await interaction.reply({ ephemeral: true, content: "c'est bon poto" });
}
