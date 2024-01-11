import { Context } from "#root/bot/context.ts";
import { TAKE_TICKET_CONVERSATION } from "#root/bot/conversations/index.ts";
import { CallbackQueryContext } from "grammy";

export const takeTicketHandler = async (ctx: CallbackQueryContext<Context>) => {
  await ctx.conversation.enter(TAKE_TICKET_CONVERSATION);
};
