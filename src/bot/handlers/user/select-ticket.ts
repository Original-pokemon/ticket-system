import { Context } from "#root/bot/context.ts";
import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { selectTicketData } from "#root/bot/callback-data/index.ts";
import { viewTicketProfile } from "./view-ticket-profile.ts";

export const showTicketHandler = async (ctx: CallbackQueryContext<Context>) => {
  const { id } = selectTicketData.unpack(ctx.callbackQuery.data);

  const ticket = await ctx.services.Ticket.getUnique(id);

  await viewTicketProfile({
    ctx,
    ticket,
    inlineKeyboard: new InlineKeyboard(),
  });
};
