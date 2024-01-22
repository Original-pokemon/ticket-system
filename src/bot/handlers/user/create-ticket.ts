import { Context } from "#root/bot/context.js";
import { CREATE_TICKET_CONVERSATION } from "#root/bot/conversations/create-ticket/create-ticket.js";
import { HearsContext } from "grammy";

export const createTicketHandler = async (ctx: HearsContext<Context>) => {
  await ctx.conversation.enter(CREATE_TICKET_CONVERSATION);
};
