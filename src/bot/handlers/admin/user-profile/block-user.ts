import { CallbackQueryContext } from "grammy";
import { blockUserData } from "#root/bot/callback-data/admin/block-user.js";
import { UserGroup } from "#root/bot/const/user-group.js";
import { Context } from "../../../context.js";

export const blockUserHandler = async (ctx: CallbackQueryContext<Context>) => {
  const { id } = blockUserData.unpack(ctx.callbackQuery.data);
  const user = await ctx.services.User.getUnique(id);

  await ctx.services.User.update({
    ...user,
    user_group: UserGroup.Blocked,
  });

  ctx.reply("User blocked successfully");
  ctx.api.sendMessage(user.id, "You are now blocked");
};
