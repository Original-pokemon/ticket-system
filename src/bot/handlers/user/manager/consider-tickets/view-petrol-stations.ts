import { UserText } from "#root/bot/const/index.ts";
import { Context } from "#root/bot/context.ts";
import { createFilteredPetrolStationsPerTicketStatusKeyboard } from "#root/bot/keyboards/index.ts";

export const viewPetrolStationsFilteredHandler = async (ctx: Context) => {
  await ctx.reply(UserText.Consider.PETROL_STATIONS, {
    reply_markup:
      await createFilteredPetrolStationsPerTicketStatusKeyboard(ctx),
  });
};
