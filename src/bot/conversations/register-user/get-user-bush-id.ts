import { selectBushData } from "#root/bot/callback-data/index.js";
import { AdminText } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { createBushKeyboard } from "#root/bot/keyboards/index.js";
import { ServicesType } from "#root/container.js";
import { Conversation } from "@grammyjs/conversations";
import { CallbackQueryContext } from "grammy";

type Properties = {
  ctx: Context;
  conversation: Conversation<Context>;
  services: ServicesType;
};

export const getUserBushId = async ({
  ctx,
  conversation,
  services,
}: Properties): Promise<[CallbackQueryContext<Context>, number]> => {
  await ctx.reply(AdminText.Admin.BUSHES, {
    reply_markup: await createBushKeyboard({ ...ctx, services }),
  });

  const bushCtx = await conversation.waitForCallbackQuery([
    selectBushData.filter(),
  ]);

  const {
    callbackQuery: { data: bush },
  } = bushCtx;
  const { id: bushId } = selectBushData.unpack(bush);

  return [bushCtx, bushId];
};
