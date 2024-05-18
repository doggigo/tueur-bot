import { Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import fs from "fs";
import path from "path";
import { client, TOKEN } from "../index";

export async function LoadSlashCommands() {
  if (!TOKEN) return;

  const commands:object[] = [];
  for (const command of client.commands) {
    commands.push(command[1].data.toJSON());
  }

  const rest = new REST().setToken(TOKEN);

  (async () => {
    try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

        let clientId = client.user?.id;
        let guildId = client.guilds.cache.first()?.id;
        if(!(clientId  && guildId)) return;

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		) as Array<Object>;
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
  })();
}
