import { UserText } from "#root/bot/const/index.ts";
import { Context } from "#root/bot/context.ts";
import { createPetrolStationsPerTicketStatusKeyboard } from "#root/bot/keyboards/index.ts";

export const viewPetrolStationsHandler = async (ctx: Context) => {
  await ctx.reply(UserText.AllTickets.PETROL_STATIONS, {
    reply_markup: await createPetrolStationsPerTicketStatusKeyboard(ctx),
  });
};
