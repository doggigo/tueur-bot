import {
  CommandInteraction,
  Guild,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { client } from "../index";

export const data = new SlashCommandBuilder()
  .setName("updatenumbers")
  .setDescription("update the taken numbers channel")
  .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

export async function execute(interaction: CommandInteraction) {
  const { TAKEN_NUMBERS_CHANNEL_ID, TAKEN_NUMBERS_MESSAGE_ID } = Bun.env;
  let guild = interaction.guild as Guild;

  let channel = (await guild.channels.fetch(
    TAKEN_NUMBERS_CHANNEL_ID as string
  )) as TextChannel;

  let message = await channel.messages.fetch(
    TAKEN_NUMBERS_MESSAGE_ID as string
  );

  let taken = Array.from(
    guild.roles.cache.filter((role, _) => role.name.match(/tueur_\d+/)).values()
  ).map((role) => role.name).sort((a,b) => parseInt(a.substring(6)) - parseInt(b.substring(6)));
  
  let res = ["Tueurs pris :"].concat(taken);
  await message.edit({ content: res.join("\n") });
}
