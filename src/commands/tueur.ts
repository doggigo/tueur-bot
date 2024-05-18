import {
  CommandInteraction,
  Guild,
  GuildMember,
  GuildMemberRoleManager,
  InteractionType,
  Role,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  type Interaction,
} from "discord.js";
import { client } from "../index";

const updateTakenNumbers = await import('./updateTakenNumbers');


export const data = new SlashCommandBuilder()
  .setName("tueur")
  .setDescription("tu dois choisir quel tueur tu es")
  .setDefaultMemberPermissions(null)
  .setDMPermission(false)
  .addIntegerOption(
    new SlashCommandIntegerOption()
      .setName("numero")
      .setDescription("QUEL NUMERO")
      .setRequired(true)
  );

const { TUEUR_ROLE_ID } = Bun.env;

const getAllUsedNumbers = (guild: Guild) => {
  let roles = Array.from(
    guild.roles.cache.filter((role, _) => role.name.match(/tueur_\d+/)).values()
  ).map((role) => parseInt(role.name.substring(6)));
  return roles;
};

const createRole = async (guild: Guild, num: number) => {
  return await guild.roles.create({ name: `tueur_${num}`, mentionable: false });
};

export async function execute(interaction: CommandInteraction) {
  let numero = interaction.options.get("numero")?.value as number;

  // si le numero existe deja
  let numerosExistants = getAllUsedNumbers(interaction.guild as Guild);
  if (numerosExistants.includes(numero)) {
    await interaction.reply({ content: "mec sa existe deja", ephemeral: true });
    return;
  }

  // sinon, on cree le role
  let role = await createRole(interaction.guild as Guild, numero);
  let tueurRole = (await interaction.guild?.roles.fetch(
    TUEUR_ROLE_ID as string,
    { cache: true }
  )) as Role;

  let roleManager = interaction.member?.roles as GuildMemberRoleManager;

  // si l'utilisateur a pas le role, le rajouter
  let rolesList = Array.from(roleManager.cache.keys());
  if (!rolesList.includes(TUEUR_ROLE_ID as string)) {
    await roleManager.add(tueurRole);
  }

  // enlever son ancien role s'il existe
  let remainingRoles = Array.from(roleManager.cache.values()).filter(
    (role, _) => role.name.match(/tueur_\d+/)
  );
  if (remainingRoles) {
    remainingRoles.forEach(async (role) => await role.delete());
  }

  await (interaction.member as GuildMember).setNickname(`tueur_${numero}`);

  await roleManager.add(role);

  updateTakenNumbers.execute(interaction);

  await interaction.reply({
    content: `sebon, tu es tueur_${numero}`,
    ephemeral: true,
  });
}
