import { Context } from "#root/bot/context.ts";
import { Conversation } from "@grammyjs/conversations";
import {
  EditPanelButtonKey,
  EditPanelButtons,
  createEditPanelKeyboard,
} from "#root/bot/keyboards/index.ts";
import { selectTicketPropertyData } from "#root/bot/callback-data/index.ts";
import {
  getPriority,
  getCategory,
} from "#root/bot/conversations/create-ticket/index.ts";
import { TicketType } from "#root/services/index.ts";
import { getPhotos } from "#root/bot/handlers/index.ts";
import { UserText } from "#root/bot/const/index.ts";

type Properties = {
  ctx: Context;
  ticket: TicketType;
  conversation: Conversation<Context>;
};

const isInclude = (callbackData: string): callbackData is EditPanelButtons =>
  Object.values(EditPanelButtonKey).includes(callbackData as EditPanelButtons);

const editTitleHandler = async ({ ctx, conversation, ticket }: Properties) => {
  await ctx.editMessageText(UserText.EditTicket.Title);
  const title = await conversation.form.text();

  return { ...ticket, title };
};

const editPriorityHandler = async ({
  ctx,
  conversation,
  ticket,
}: Properties) => {
  const [ticketPriority] = await getPriority({ ctx, conversation });

  return { ...ticket, ticket_priority: ticketPriority };
};

const _editPhotoHandler = async ({ ctx, conversation, ticket }: Properties) => {
  const [photos] = await getPhotos({ ctx, conversation });

  return { ...ticket, attachments: photos };
};

const editDescriptionHandler = async ({
  ctx,
  conversation,
  ticket,
}: Properties) => {
  await ctx.editMessageText(UserText.EditTicket.Description);
  const description = await conversation.form.text();

  return { ...ticket, description };
};

const editCategoryHandler = async ({
  ctx,
  conversation,
  ticket,
}: Properties) => {
  await ctx.deleteMessage();
  const [ticketCategory, categoryCtx] = await getCategory({
    ctx,
    conversation,
  });

  await categoryCtx.deleteMessage();

  return { ...ticket, ticket_category: ticketCategory };
};

const ButtonHandler = {
  [EditPanelButtonKey.TITLE]: editTitleHandler,
  [EditPanelButtonKey.PRIORITY]: editPriorityHandler,
  [EditPanelButtonKey.DESCRIPTION]: editDescriptionHandler,
  [EditPanelButtonKey.CATEGORY]: editCategoryHandler,
} as const;

export const editTicket = async ({ ctx, conversation, ticket }: Properties) => {
  await ctx.deleteMessage();
  await ctx.reply(UserText.EditTicket.EditPanelTitle, {
    reply_markup: createEditPanelKeyboard(),
  });

  const editPanelCtx = await conversation.waitForCallbackQuery(
    selectTicketPropertyData.filter(),
  );

  editPanelCtx.services = ctx.services;

  const {
    callbackQuery: { data: selectProperty },
  } = editPanelCtx;

  const { id } = selectTicketPropertyData.unpack(selectProperty);

  if (isInclude(id)) {
    const newTicket = await ButtonHandler[id]({
      ctx: editPanelCtx,
      conversation,
      ticket,
    });

    return newTicket;
  }

  throw new Error("Invalid select property");
};
