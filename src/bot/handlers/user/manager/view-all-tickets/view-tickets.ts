import { UserText } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { createTicketsPerPetrolStationKeyboard } from "#root/bot/keyboards/index.js";
import { CallbackQueryContext } from "grammy";

export const showTicketsHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  await ctx.editMessageText(UserText.AllTickets.TICKETS, {
    reply_markup: await createTicketsPerPetrolStationKeyboard(ctx),
  });
};
