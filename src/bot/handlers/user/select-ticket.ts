import { Context } from "#root/bot/context.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { selectTicketData } from "#root/bot/callback-data/index.js";
import { viewTicketProfile } from "./view-ticket-profile.js";

export const showTicketHandler = async (ctx: CallbackQueryContext<Context>) => {
  const { id } = selectTicketData.unpack(ctx.callbackQuery.data);

  const ticket = await ctx.services.Ticket.getUnique(id);

  await viewTicketProfile({
    ctx,
    ticket,
    inlineKeyboard: new InlineKeyboard(),
  });
};
