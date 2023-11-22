import { selectPetrolStationData } from "#root/bot/callback-data/index.js";
import { AdminText } from "#root/bot/const/text.js";
import { Context } from "#root/bot/context.js";
import { createPetrolStationKeyboard } from "#root/bot/keyboards/index.js";
import { CallbackQueryContext } from "grammy";

export const selectPetrolStationHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const {
    callbackQuery,
    session: { customData },
  } = ctx;
  const { id } = selectPetrolStationData.unpack(callbackQuery.data);

  if (id in customData) {
    delete customData[id];
  } else {
    customData[id] = true;
  }
  await ctx.editMessageText(AdminText.AdminCommand.USERS, {
    reply_markup: await createPetrolStationKeyboard(ctx),
  });
};
