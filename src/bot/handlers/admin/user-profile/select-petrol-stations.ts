import { selectPetrolStationAdminData } from "#root/bot/callback-data/index.js";
import { AdminText } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { createPetrolStationsMultiKeyboard } from "#root/bot/keyboards/index.js";
import { CallbackQueryContext } from "grammy";

export const selectPetrolStationsHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { callbackQuery, session } = ctx;
  const { id } = selectPetrolStationAdminData.unpack(callbackQuery.data);

  if (id in session.customData) {
    delete session.customData[id];
  } else {
    session.customData[id] = true;
  }
  await ctx.editMessageText(AdminText.Admin.USERS, {
    reply_markup: await createPetrolStationsMultiKeyboard(ctx),
  });
};
