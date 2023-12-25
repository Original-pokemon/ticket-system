import { selectGroupData } from "#root/bot/callback-data/index.ts";
import { AdminText } from "#root/bot/const/index.ts";
import { Context } from "#root/bot/context.ts";
import { createGroupKeyboard } from "#root/bot/keyboards/index.ts";
import { ServicesType } from "#root/container.ts";
import { Conversation } from "@grammyjs/conversations";
import { CallbackQueryContext } from "grammy";

type Properties = {
  ctx: Context;
  conversation: Conversation<Context>;
  services: ServicesType;
};

export const getUserGroupId = async ({
  ctx,
  conversation,
  services,
}: Properties): Promise<[CallbackQueryContext<Context>, string]> => {
  await ctx.editMessageText("Выберите группу пользователя", {
    reply_markup: await createGroupKeyboard({ ...ctx, services }),
  });

  const groupCtx = await conversation.waitForCallbackQuery(
    selectGroupData.filter(),
  );

  const { id: groupId } = selectGroupData.unpack(groupCtx.callbackQuery.data);

  await groupCtx.editMessageText(AdminText.Admin.EDIT_USER_NAME);

  return [groupCtx, groupId];
};
