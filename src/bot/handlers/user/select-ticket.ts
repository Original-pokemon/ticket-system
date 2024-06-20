import { Context } from "#root/bot/context.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { selectTicketData } from "#root/bot/callback-data/index.js";
import { viewTicketProfile } from "./view-ticket-profile.js";

export const showTicketHandler = async (ctx: CallbackQueryContext<Context>) => {
  const { id: ticketId } = selectTicketData.unpack(ctx.callbackQuery.data);

  await viewTicketProfile({
    ctx,
    ticketId,
    inlineKeyboard: new InlineKeyboard(),
  });
};
