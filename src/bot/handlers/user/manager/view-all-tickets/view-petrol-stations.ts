import { UserText } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { createPetrolStationsPerTicketStatusKeyboard } from "#root/bot/keyboards/index.js";

export const viewPetrolStationsHandler = async (ctx: Context) => {
  await ctx.reply(UserText.AllTickets.PETROL_STATIONS, {
    reply_markup: await createPetrolStationsPerTicketStatusKeyboard(ctx),
  });
};
