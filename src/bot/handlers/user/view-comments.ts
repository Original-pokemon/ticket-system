import { Context } from "#root/bot/context.js";
import { getCommentText } from "#root/bot/helpers/index.js";
import { config } from "#root/config.js";
import { InputMediaPhoto } from "@grammyjs/types";
import { InputFile } from "grammy";
import { join } from "node:path";

type Comment = {
  userName: string;
  text: string;
  attachments: string[] | undefined;
};

type Properties = {
  ctx: Context;
  comments: Comment[];
};

export const createPhotosGroup = (
  paths: string[],
): InputMediaPhoto<InputFile>[] =>
  paths.map((path) => ({
    type: "photo",
    media: new InputFile({
      url: join(config.BACKEND_URL, path),
    }),
  }));

export const viewTicketComment = async ({ ctx, comments }: Properties) => {
  const promises = comments.map(async ({ attachments, text, userName }) => {
    await ctx.reply(getCommentText(text, userName));
    if (attachments && attachments.length > 0) {
      const photoInputs = createPhotosGroup(attachments);

      await ctx.replyWithMediaGroup(photoInputs);
    }
  });

  await Promise.all(promises);
};
