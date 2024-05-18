import path from "path";
import fs from "node:fs";
import { client } from "../index";

export async function fetchSlashCommands() {
  const commandsPath = path.join(__dirname, "../commands");
  console.log(commandsPath);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((fileName) => fileName.endsWith("js") || fileName.endsWith("ts"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}
