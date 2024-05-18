// Discord imports
import { Client, Collection, GatewayIntentBits } from "discord.js";

// module augmentations imports
import "./client-augmentation.d.ts";

// Local imports
import { LoadSlashCommands } from "./loaders/loadSlashCommands";
import { fetchSlashCommands } from "./loaders/fetchSlashCommands.ts";

export const { TOKEN } = Bun.env;

const intents: GatewayIntentBits[] = [GatewayIntentBits.Guilds];

export const client = new Client({
  intents: intents,
});
client.commands = new Collection();

client.once("ready", async () => {
  console.log(`Connecté en tant que ${client.user?.id}`);
  await fetchSlashCommands();
  LoadSlashCommands();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(
      `il est debile ${interaction.user.globalName} ca existe pas la commande ${interaction.commandName}`
    );
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "HEU YA UN PROBLEME AVEC TA COMANDE",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "HEU YA UN PROBLEME AVEC TA COMANDE",
        ephemeral: true,
      });
    }
  }
});

client.login(TOKEN);
