import { UserText } from "#root/bot/const/index.ts";
import { Context } from "#root/bot/context.ts";
import { createTicketsPerPetrolStationKeyboard } from "#root/bot/keyboards/index.ts";
import { CallbackQueryContext } from "grammy";

export const showTicketsHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  await ctx.editMessageText(UserText.AllTickets.TICKETS, {
    reply_markup: await createTicketsPerPetrolStationKeyboard(ctx),
  });
};
