import { UserText } from "#root/bot/const/index.ts";
import { Context } from "#root/bot/context.ts";
import { createAllTicketsKeyboard } from "#root/bot/keyboards/index.ts";

export const showTicketsForPetrolStationHandler = async (ctx: Context) => {
  await ctx.reply(UserText.AllTickets.TICKETS, {
    reply_markup: await createAllTicketsKeyboard(ctx),
  });
};
