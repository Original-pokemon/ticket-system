import { Context } from "#root/bot/context.js";
import { TAKE_TICKET_CONVERSATION } from "#root/bot/conversations/index.js";
import { CallbackQueryContext } from "grammy";

export const takeTicketHandler = async (ctx: CallbackQueryContext<Context>) => {
  await ctx.conversation.enter(TAKE_TICKET_CONVERSATION);
};
