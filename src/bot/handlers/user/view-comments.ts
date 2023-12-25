import { UserText } from "#root/bot/const/index.ts";
import { Context } from "#root/bot/context.ts";
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
  comments.map(async ({ attachments, text, userName }) => {
    if (attachments) {
      const photoInputs = createPhotosGroup(attachments);

      await ctx.reply(
        `${UserText.ViewComment.USER}: ${userName} \n${UserText.ViewComment.TEXT}: ${text}`,
      );
      await ctx.replyWithMediaGroup(photoInputs);
    }
  });
};
