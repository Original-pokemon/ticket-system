/* eslint-disable camelcase */
import { selectCategoryData } from "#root/bot/callback-data/index.js";
import { AdminText } from "#root/bot/const/text.js";
import { Context } from "#root/bot/context.js";
import { CallbackQueryContext } from "grammy";

export const saveCategoryHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const {
    callbackQuery,
    session: { selectUser },
    services: { TaskPerformer },
  } = ctx;
  const { id: category_id } = selectCategoryData.unpack(callbackQuery.data);

  if (!selectUser) {
    throw new Error("User not Selected");
  }
  const taskPerformer = await TaskPerformer.getUnique(selectUser);

  await TaskPerformer.update({
    ...taskPerformer,
    category_id,
  });

  await ctx.editMessageText(AdminText.AdminCommand.SAVE_RELATIONSHIP);
};
