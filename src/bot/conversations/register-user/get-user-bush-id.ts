import { selectBushData } from "#root/bot/callback-data/index.ts";
import { AdminText } from "#root/bot/const/text.ts";
import { Context } from "#root/bot/context.ts";
import { createBushKeyboard } from "#root/bot/keyboards/index.ts";
import { ServicesType } from "#root/container.ts";
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
  await ctx.reply(AdminText.AdminCommand.BUSHES, {
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
