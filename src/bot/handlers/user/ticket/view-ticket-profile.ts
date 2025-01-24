import { Context } from "#root/bot/context.js";
import { InlineKeyboard, InputFile } from "grammy";
import { CommentType } from "#root/types/index.js";
import { getTicketText, getCommentText } from "#root/bot/helpers/index.js";
import { ServicesType } from "#root/container.js";

import { InputMediaPhoto } from "@grammyjs/types";

type ViewTicketProfileProperties = {
  ctx: Context;
  ticketId: string;
  inlineKeyboard: InlineKeyboard;
};

type ExtendedComment = {
  userName: string;
  text: string;
  attachments: string[];
};

type Comment = {
  userName: string;
  text: string;
  attachments: string[] | undefined;
};

type ViewTicketCommentProperties = {
  ctx: Context;
  comments: Comment[];
};

export const createPhotosGroup = (
  paths: string[],
): InputMediaPhoto<InputFile>[] =>
  paths.map((path) => ({
    type: "photo",
    media: new InputFile({
      url: path,
    }),
  }));

export const viewTicketComment = async ({
  ctx,
  comments,
}: ViewTicketCommentProperties) => {
  const promises = comments.map(async ({ attachments, text, userName }) => {
    await ctx.reply(getCommentText(text, userName));
    if (attachments && attachments.length > 0) {
      const photoInputs = createPhotosGroup(attachments);

      await ctx.replyWithMediaGroup(photoInputs);
    }
  });

  await Promise.all(promises);
};

async function getFormattedComments(
  commentList: CommentType[],
  services: ServicesType,
): Promise<ExtendedComment[]> {
  const userIds = [...new Set(commentList.map((c) => c.user_id))];

  const users = await services.User.getSelect(userIds);
  const userMap = new Map(users.map((u) => [u.id, u.user_name]));

  return commentList.map((comment) => {
    const { user_id: userId, text, attachments } = comment;

    const userName = userMap.get(userId) ?? "Неизвестно";

    const attachmentsPath = attachments.map((attachment) =>
      typeof attachment === "string" ? attachment : attachment.path,
    );

    return {
      userName,
      text,
      attachments: attachmentsPath,
    };
  });
}

export const getTicketProfileData = async ({
  ctx,
  ticketId,
}: Omit<ViewTicketProfileProperties, "inlineKeyboard">) => {
  const { services } = ctx;
  const ticket = await services.Ticket.getUnique(ticketId);

  const attachmentsPromise =
    ticket.attachments.length > 0
      ? services.Attachment.getSelect(ticket.attachments)
      : Promise.resolve([]);

  const commentsPromise =
    ticket.comments.length > 0
      ? services.Comment.getSelect(ticket.comments)
      : Promise.resolve([]);

  const [attachmentList, profile, commentList] = await Promise.all([
    attachmentsPromise,
    getTicketText(ctx, ticket),
    commentsPromise,
  ]);

  const descriptionAttachmentPaths = attachmentList.map(
    (attachment) => attachment.path,
  );

  const commentObjects = await getFormattedComments(commentList, services);

  return {
    profile,
    descriptionAttachmentPaths,
    commentObjects,
  };
};

export const viewTicketProfile = async ({
  ctx,
  ticketId,
  inlineKeyboard,
}: ViewTicketProfileProperties) => {
  const { profile, descriptionAttachmentPaths, commentObjects } =
    await getTicketProfileData({ ctx, ticketId });

  if (descriptionAttachmentPaths.length > 0) {
    await ctx.replyWithMediaGroup(
      createPhotosGroup(descriptionAttachmentPaths),
    );
  }

  await ctx.reply(profile, {
    reply_markup: inlineKeyboard,
  });

  await viewTicketComment({
    ctx,
    comments: commentObjects,
  });
};
