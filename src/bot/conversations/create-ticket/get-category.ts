import { selectCategoryData } from "#root/bot/callback-data/index.js";
import { UserText } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { createCategoryKeyboard } from "#root/bot/keyboards/index.js";
import { Conversation } from "@grammyjs/conversations";

type Properties = {
  ctx: Context;
  conversation: Conversation<Context>;
};

export const getCategory = async ({
  ctx,
  conversation,
}: Properties): Promise<[string, Context]> => {
  await ctx.reply(UserText.CreateTicket.CATEGORY, {
    reply_markup: await createCategoryKeyboard(ctx),
  });

  const categoryCtx = await conversation.waitForCallbackQuery([
    selectCategoryData.filter(),
  ]);

  const {
    callbackQuery: { data: category },
  } = categoryCtx;
  const { id: categoryId } = selectCategoryData.unpack(category);

  categoryCtx.services = ctx.services;
  return [categoryId, categoryCtx];
};
