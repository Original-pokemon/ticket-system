import { Context } from "#root/bot/context.ts";
import { InlineKeyboard } from "grammy";
import { CommentType, TicketType } from "#root/services/index.ts";
import { getTicketText } from "#root/bot/helpers/index.ts";
import { UserText } from "#root/bot/const/index.ts";
import { ServicesType } from "#root/container.ts";
import { createPhotosGroup, viewTicketComment } from "./view-comments.ts";

type Properties = {
  ctx: Context;
  ticket: TicketType;
  inlineKeyboard: InlineKeyboard;
};

const getCommentObject = async (
  comment: CommentType,
  services: ServicesType,
) => {
  const { user_id: userId, text, attachments: commentAttachmentsId } = comment;
  const { user_name: userName } = await services.User.getUnique(userId);
  const attachments = await services.Attachment.getSelect(commentAttachmentsId);
  const attachmentsPath = attachments.map((attachment) => attachment.path);

  return { userName, text, attachments: attachmentsPath };
};

export const viewTicketProfile = async ({
  ctx,
  ticket,
  inlineKeyboard,
}: Properties) => {
  const {
    comments: commentsId,
    description,
    attachments: ticketAttachmentIds,
  } = ticket;
  const profile = await getTicketText(ctx, ticket);
  const descriptionAttachments =
    await ctx.services.Attachment.getSelect(ticketAttachmentIds);
  const descriptionAttachmentPaths = descriptionAttachments.map(
    (attachment) => attachment.path,
  );

  const comments = await ctx.services.Comment.getSelect(commentsId);

  const promises = comments.map(async (comment) => {
    const commentsObject = await getCommentObject(comment, ctx.services);
    return commentsObject;
  });

  const commentObjects = await Promise.all(promises);

  await ctx.reply(`${UserText.TicketProfile.DESCRIPTION}:\n ${description}`);

  if (descriptionAttachmentPaths.length > 0) {
    await ctx.replyWithMediaGroup(
      createPhotosGroup(descriptionAttachmentPaths),
    );
  }

  await viewTicketComment({
    ctx,
    comments: commentObjects,
  });
  await ctx.reply(profile, {
    reply_markup: inlineKeyboard,
  });
};
