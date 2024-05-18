import { Client, Collection, SlashCommandBuilder } from 'discord.js'

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, {execute: (interaction: CommandInteraction) => Promise<void>, data: SlashCommandBuilder}>
  }
}