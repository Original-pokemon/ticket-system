import { selectManagerData } from "#root/bot/callback-data/index.js";
import { AdminText } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { createManagersKeyboard } from "#root/bot/keyboards/index.js";
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
