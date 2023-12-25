import { Context } from "#root/bot/context.ts";
import { CREATE_TICKET_CONVERSATION } from "#root/bot/conversations/create-ticket/create-ticket.ts";
import { HearsContext } from "grammy";

export const createTicketHandler = async (ctx: HearsContext<Context>) => {
  await ctx.conversation.enter(CREATE_TICKET_CONVERSATION);
};
