import { CallbackQueryContext } from "grammy";
import { blockUserData } from "#root/bot/callback-data/index.js";
import { UserGroup, AdminText } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";

export const blockUserHandler = async (ctx: CallbackQueryContext<Context>) => {
  const { id } = blockUserData.unpack(ctx.callbackQuery.data);
  const user = await ctx.services.User.getUnique(id);

  await ctx.services.User.update({
    ...user,
    user_group: UserGroup.Blocked,
  });

  await ctx.reply(AdminText.Block.USER_BLOCK);
  await ctx.api.sendMessage(user.id, AdminText.Block.USER_MESSAGE);
};
