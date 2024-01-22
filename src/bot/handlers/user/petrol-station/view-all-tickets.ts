import { UserText } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { createAllTicketsKeyboard } from "#root/bot/keyboards/index.js";

export const showTicketsForPetrolStationHandler = async (ctx: Context) => {
  await ctx.reply(UserText.AllTickets.TICKETS, {
    reply_markup: await createAllTicketsKeyboard(ctx),
  });
};
