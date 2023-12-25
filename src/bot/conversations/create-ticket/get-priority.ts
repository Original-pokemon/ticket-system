import { selectPriorityData } from "#root/bot/callback-data/index.ts";
import { UserText } from "#root/bot/const/index.ts";
import { Context } from "#root/bot/context.ts";
import { createPriorityKeyboard } from "#root/bot/keyboards/index.ts";
import { Conversation } from "@grammyjs/conversations";

type Properties = {
  ctx: Context;
  conversation: Conversation<Context>;
};

export const getPriority = async ({
  ctx,
  conversation,
}: Properties): Promise<[number, Context]> => {
  await ctx.editMessageText(UserText.CreateTicket.PRIORITY, {
    reply_markup: await createPriorityKeyboard(ctx),
  });

  const priorityCtx = await conversation.waitForCallbackQuery([
    selectPriorityData.filter(),
  ]);

  const {
    callbackQuery: { data: category },
  } = priorityCtx;
  const { id: priorityId } = selectPriorityData.unpack(category);

  priorityCtx.services = ctx.services;

  return [priorityId, priorityCtx];
};
