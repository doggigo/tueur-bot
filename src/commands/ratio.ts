import { CommandInteraction, Message, SlashCommandBuilder, TextChannel, type Channel } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('ratio')
    .setDescription('JE TAIDE A RATIO TON GAVA')
    .setDefaultMemberPermissions(null)
    .setDMPermission(false)

export async function ratio(message:Message){
    await message.react('💬')
    await message.react('🔁')
    await message.react('❤️')
}

export async function execute(interaction: CommandInteraction){
    await interaction.reply({content:'vasy envoie un message', fetchReply: true, ephemeral: true})
    let filter = (m: Message) => m.author.id === interaction.user.id
    let collected = await (interaction.channel as TextChannel).awaitMessages({ filter, max: 1, time: 30000 })
    const message = collected.first();
    await ratio(message as Message);
}