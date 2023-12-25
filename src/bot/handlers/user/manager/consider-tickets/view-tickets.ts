import { UserText } from "#root/bot/const/text.ts";
import { Context } from "#root/bot/context.ts";
import { createFilteredTicketsPerPetrolStationKeyboard } from "#root/bot/keyboards/index.ts";
import { CallbackQueryContext } from "grammy";

export const showTicketsFilteredPerTicketStatusHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  await ctx.editMessageText(UserText.Consider.TICKETS, {
    reply_markup: await createFilteredTicketsPerPetrolStationKeyboard(ctx),
  });
};
