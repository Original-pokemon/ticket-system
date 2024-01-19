import { UserText } from "#root/bot/const/text.ts";
import { Context } from "#root/bot/context.ts";
import { createFilteredTicketsKeyboard } from "#root/bot/keyboards/index.ts";
import { CallbackQueryContext } from "grammy";

export const showTicketsFilteredHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  await ctx.editMessageText(UserText.Consider.TICKETS, {
    reply_markup: await createFilteredTicketsKeyboard(ctx),
  });
};
