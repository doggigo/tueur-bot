import { Guild, GuildMember, Message } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";

export async function quivoc(msg: Message) {
  await msg.reply("j arrive 🙂");
  const voiceChannel = (msg.member as GuildMember).voice.channelId;
  if (!voiceChannel) return;
  const guild = (msg.guild as Guild).id;
  const voiceAdapterCreator = (msg.guild as Guild).voiceAdapterCreator;

  const voiceConnection = joinVoiceChannel({
    channelId: voiceChannel,
    guildId: guild,
    adapterCreator: voiceAdapterCreator,
  });
  setTimeout(() => {
    voiceConnection.disconnect();
  }, 30000);
}
