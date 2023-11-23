import { selectManagerData } from "#root/bot/callback-data/index.ts";
import { AdminText } from "#root/bot/const/text.ts";
import { Context } from "#root/bot/context.ts";
import { createManagersKeyboard } from "#root/bot/keyboards/index.ts";
import { CallbackQueryContext } from "grammy";

export const selectManagerHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const {
    callbackQuery,
    session: { customData },
  } = ctx;
  const { id } = selectManagerData.unpack(callbackQuery.data);

  if (id in customData) {
    delete customData[id];
  } else {
    customData[id] = true;
  }
  await ctx.editMessageText(AdminText.AdminCommand.USERS, {
    reply_markup: await createManagersKeyboard(ctx),
  });
};
