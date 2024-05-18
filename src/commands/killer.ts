import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("killer")
  .setDescription("🙂");

export async function execute(interaction: CommandInteraction) {
  let res = await fetch("https://tueur.robinmerde.fr/", { method: "GET" });
  let json = await res.json() as string;
  if(!json) return;
  await interaction.followUp({ content: json as string });
}