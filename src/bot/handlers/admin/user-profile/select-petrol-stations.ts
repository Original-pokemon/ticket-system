import { selectPetrolStationAdminData } from "#root/bot/callback-data/index.ts";
import { AdminText } from "#root/bot/const/index.ts";
import { Context } from "#root/bot/context.ts";
import { createPetrolStationsMultiKeyboard } from "#root/bot/keyboards/index.ts";
import { CallbackQueryContext } from "grammy";

export const selectPetrolStationsHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const {
    callbackQuery,
    session: { customData },
  } = ctx;
  const { id } = selectPetrolStationAdminData.unpack(callbackQuery.data);

  if (id in customData) {
    delete customData[id];
  } else {
    customData[id] = true;
  }
  await ctx.editMessageText(AdminText.Admin.USERS, {
    reply_markup: await createPetrolStationsMultiKeyboard(ctx),
  });
};
