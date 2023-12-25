import { Context } from "#root/bot/context.ts";
import { EDIT_TICKET_CONVERSATION } from "#root/bot/conversations/edit-ticket/edit-ticket.ts";
import { CallbackQueryContext } from "grammy";

export const editTicketHandler = async (ctx: CallbackQueryContext<Context>) => {
  await ctx.conversation.enter(EDIT_TICKET_CONVERSATION);
};
