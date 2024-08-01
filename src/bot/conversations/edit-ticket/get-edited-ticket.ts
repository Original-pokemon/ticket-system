import { Context } from "#root/bot/context.js";
import { Conversation } from "@grammyjs/conversations";
import {
  EditPanelButtonKey,
  EditPanelButtons,
  createEditPanelKeyboard,
} from "#root/bot/keyboards/index.js";
import { selectTicketPropertyData } from "#root/bot/callback-data/index.js";
import { getCategory } from "#root/bot/conversations/create-ticket/index.js";
import { TicketType } from "#root/services/index.js";
import { getPhotos } from "#root/bot/handlers/index.js";
import { UserText } from "#root/bot/const/index.js";

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

const _editPhotoHandler = async ({ ctx, conversation, ticket }: Properties) => {
  await ctx.deleteMessage();

  const [photos] = await getPhotos({
    ctx,
    conversation,
  });

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
    const newTicket: TicketType = await ButtonHandler[id]({
      ctx: editPanelCtx,
      conversation,
      ticket: {
        ...ticket,
        status_history: [
          { user_id: ctx.session.user.id, ticket_status: ticket.status_id },
        ],
      },
    });

    return newTicket;
  }

  throw new Error("Invalid select property");
};
