import { selectCategoryData } from "#root/bot/callback-data/index.js";
import { UserText } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { createCategoryKeyboard } from "#root/bot/keyboards/index.js";
import { Conversation } from "@grammyjs/conversations";
import { InlineKeyboard } from "grammy";

type Properties = {
  ctx: Context;
  conversation: Conversation<Context>;
};

export const getCategory = async ({
  ctx,
  conversation,
}: Properties): Promise<[string, Context]> => {
  const keyboard = await createCategoryKeyboard(ctx);

  await ctx.reply(UserText.CreateTicket.CATEGORY, {
    reply_markup: keyboard,
  });

  const cancelCallback = "cancel_creation";

  const categoryCtx = await conversation.waitForCallbackQuery(
    [selectCategoryData.filter()],
    {
      otherwise: async (answerCtx) => {
        if (answerCtx.hasCallbackQuery(cancelCallback)) {
          await answerCtx.conversation.exit();

          await answerCtx.editMessageText(
            UserText.CreateTicket.Interrupt.BEEN_INTERRUPTED,
          );
        } else {
          await answerCtx.reply(UserText.CreateTicket.CATEGORY, {
            reply_markup: keyboard,
          });
          await ctx.reply(UserText.CreateTicket.Interrupt.SELECT_CATEGORY, {
            reply_markup: InlineKeyboard.from([
              [
                {
                  text: UserText.CreateTicket.Interrupt.ABORT,
                  callback_data: cancelCallback,
                },
              ],
            ]),
          });
        }
      },
      drop: true,
    },
  );

  const {
    callbackQuery: { data: category },
  } = categoryCtx;
  const { id: categoryId } = selectCategoryData.unpack(category);

  categoryCtx.services = ctx.services;
  return [categoryId, categoryCtx];
};
