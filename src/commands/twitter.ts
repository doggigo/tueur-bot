import {
  SlashCommandBuilder,
  CommandInteraction,
  SlashCommandStringOption,
  SlashCommandAttachmentOption,
  Attachment,
  type CommandInteractionOption,
  TextChannel,
} from "discord.js";
import twitter, { TwitterApi, type SendTweetV2Params } from "twitter-api-v2";
import https from "https";
import ffmpeg from "fluent-ffmpeg";

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_KEY,
  TWITTER_ACCESS_SECRET,
} = Bun.env;

export const data = new SlashCommandBuilder()
  .setName("tweet")
  .setDescription("tweeter ta capter")
  .setDMPermission(true)
  .setDefaultMemberPermissions(null)
  .addStringOption(
    new SlashCommandStringOption()
      .setName("message")
      .setDescription("Message à envoyer")
      .setRequired(true)
  )
  .addAttachmentOption(
    new SlashCommandAttachmentOption()
      .setName("media")
      .setDescription("media")
      .setRequired(false)
  )
  .addStringOption(
    new SlashCommandStringOption()
      .setName("reponse")
      .setDescription("lien du tweet auquel répondre")
      .setRequired(false)
  )

export async function execute(interaction: CommandInteraction) {
  async function downloadUploadFile(
    url: string,
    client: TwitterApi,
    type: string
  ) {
    return new Promise<string>((resolve, reject) => {
      const request = https.get(url, (response) => {
        const chunks: any[] = [];

        response.on("data", (chunk) => {
          chunks.push(chunk);
        });

        response.on("end", async () => {
          const buffer = Buffer.concat(chunks);
          const mediaId = await client.v1.uploadMedia(buffer, {
            mimeType: type,
          });

          resolve(mediaId);
        });
      });
      request.on("error", (error) => {
        reject(error);
      });
    });
  }

  const TwitterClient = new TwitterApi({
    appKey: TWITTER_CONSUMER_KEY as string,
    appSecret: TWITTER_CONSUMER_SECRET as string,
    accessToken: TWITTER_ACCESS_KEY as string,
    accessSecret: TWITTER_ACCESS_SECRET as string,
  });

  const message = (
    interaction.options.get("message") as CommandInteractionOption
  ).value as string;

  const body: Partial<SendTweetV2Params> = {};

  const user = interaction.user;

  let mediaOption = interaction.options.get("media");
  if (mediaOption) {
    const media: Attachment = mediaOption.attachment as Attachment;

    const mediaId = await downloadUploadFile(
      media.url,
      TwitterClient,
      media.contentType as string
    );

    body["media"] = {
      media_ids: [mediaId.toString()],
    };
  }

  let responseOption = interaction.options.get("reponse");
  if (responseOption) {
    const reponse = responseOption.value as string;
    const pattern = /\/status\/(\d*)/;

    const reponseId = (reponse.match(pattern) as RegExpMatchArray)[1];

    if (reponseId) {
      body["reply"] = {
        in_reply_to_tweet_id: reponseId,
      };
    } else {
      interaction.reply("c pas le bon identifiant");
    }
  }

  try {
    console.log(`tweet ${message.toString()}`);
    const tweet = await TwitterClient.v2.tweet(message.toString(), body);
    await (interaction.channel as TextChannel).send(
      `tweet de <@${user.id}> https://x.com/minecraftcooI/status/${tweet.data.id}`
    );
  } catch (error) {
    console.log(error);
  }
  return null;
}
