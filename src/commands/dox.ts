import {
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  SlashCommandUserOption,
} from "discord.js";

import mots from "../assets/mots.json" assert { type: "json" };
import prenoms from "../assets/prenoms.json" assert { type: "json" };
import { getRandomElement, getRandomNumber } from "../utils/random";

export const data = new SlashCommandBuilder()
  .setName("dox")
  .setDescription("GROS DOX")
  .setDefaultMemberPermissions(null)
  .setDMPermission(false)
  .addUserOption(
    new SlashCommandUserOption()
      .setName("utilisateur")
      .setDescription("le connard que tu veux dox")
      .setRequired(true)
  );

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.substring(1).toLowerCase();
};

const ipAddress = () => {
  const forbiddenNums = [0, 1, 168, 192];
  const eightBits = () => {
    let num = getRandomNumber(256);
    if (!forbiddenNums.includes(num)) return num;
    return eightBits();
  };

  return `${eightBits()}.${eightBits()}.${eightBits()}.${eightBits()}`;
};

const phoneNumber = () => {
  const twoDigits = () => getRandomNumber(100).toString().padStart(2, "0");

  return `${getRandomElement([
    "06",
    "07",
  ])} ${twoDigits()} ${twoDigits()} ${twoDigits()} ${twoDigits()}`;
};

export async function execute(interaction: CommandInteraction) {
  /*
  Dox :
    - Prenom
    - Nom
    - Adresse
    - Numero
    - Ip
    - Photo
  */
  let name = <string>interaction.options.get('utilisateur')?.user?.username;

  let prenom = capitalize(name?.split(" ")[0] as string);
  // Si y a son prenom dans son pseudo
  if (!prenoms.includes(prenom)) {
    prenom = getRandomElement(prenoms);
  }

  let nom = getRandomElement(mots).toUpperCase();
  let numero = phoneNumber();
  let ip = ipAddress();

  let infos = [`DOX DE ${name}`, `Nom : ${prenom} ${nom}`, `IP : ${ip}`, `Numero : ${numero}`]

  await interaction.reply({
    content: infos.join('\n')
  });
}
