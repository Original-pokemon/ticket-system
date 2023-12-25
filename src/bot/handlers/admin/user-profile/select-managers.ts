import { selectManagerData } from "#root/bot/callback-data/index.ts";
import { AdminText } from "#root/bot/const/index.ts";
import { Context } from "#root/bot/context.ts";
import { createManagersKeyboard } from "#root/bot/keyboards/index.ts";
import { CallbackQueryContext } from "grammy";

export const selectManagersHandler = async (
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
  await ctx.editMessageText(AdminText.Admin.USERS, {
    reply_markup: await createManagersKeyboard(ctx),
  });
};
