import { Context } from "#root/bot/context.ts";
import { getCommentText } from "#root/bot/helpers/index.ts";
import { InputMediaPhoto } from "@grammyjs/types";
import { InputFile } from "grammy";

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
    media: new InputFile(path),
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
