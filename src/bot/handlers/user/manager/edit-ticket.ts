import { Context } from "#root/bot/context.js";
import { EDIT_TICKET_CONVERSATION } from "#root/bot/conversations/edit-ticket/edit-ticket.js";
import { CallbackQueryContext } from "grammy";

export const editTicketHandler = async (ctx: CallbackQueryContext<Context>) => {
  await ctx.conversation.enter(EDIT_TICKET_CONVERSATION);
};
