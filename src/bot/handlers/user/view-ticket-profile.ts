import { Context } from "#root/bot/context.ts";
import { InlineKeyboard } from "grammy";
import { TicketType } from "#root/services/index.ts";
import { getTicketText } from "#root/bot/helpers/index.ts";
import { UserText } from "#root/bot/const/index.ts";
import { createPhotosGroup, viewTicketComment } from "./view-comments.ts";

type Properties = {
  ctx: Context;
  ticket: TicketType;
  inlineKeyboard: InlineKeyboard;
};

export const viewTicketProfile = async ({
  ctx,
  ticket,
  inlineKeyboard,
}: Properties) => {
  const { comments, description, attachments: attachmentIds } = ticket;
  const profile = await getTicketText(ctx, ticket);
  const descriptionAttachments =
    await ctx.services.Attachment.getSelect(attachmentIds);
  const descriptionAttachmentPaths = descriptionAttachments.map(
    (attachment) => attachment.path,
  );
  const commentsObjects =
    comments?.map(async ({ user_id: userId, text, attachments }) => {
      const { user_name: userName } = await ctx.services.User.getUnique(userId);
      const attachmentsPaths = attachments.map((attachment) => attachment.path);

      return { userName, text, attachments: attachmentsPaths };
    }) || [];
  const resolvedCommentsObjects = await Promise.all(commentsObjects);

  await ctx.reply(`${UserText.TicketProfile.DESCRIPTION}:\n ${description}`);

  if (descriptionAttachmentPaths.length > 0) {
    await ctx.replyWithMediaGroup(
      createPhotosGroup(descriptionAttachmentPaths),
    );
  }
  await viewTicketComment({
    ctx,
    comments: resolvedCommentsObjects,
  });
  await ctx.reply(profile, {
    reply_markup: inlineKeyboard,
  });
};
