import { UserText } from "#root/bot/const/text.js";
import { Context } from "#root/bot/context.js";
import { createFilteredTicketsKeyboard } from "#root/bot/keyboards/index.js";
import { CallbackQueryContext } from "grammy";

export const showTicketsFilteredHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  await ctx.editMessageText(UserText.Consider.TICKETS, {
    reply_markup: await createFilteredTicketsKeyboard(ctx),
  });
};
