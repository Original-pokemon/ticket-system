import { CallbackQueryContext } from "grammy";
import { UserGroup } from "#root/bot/const/user-group.ts";
import { unBlockUserData } from "#root/bot/callback-data/admin/unblock-user.ts";
import { Context } from "../../../context.ts";

export const unblockUserHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { id } = unBlockUserData.unpack(ctx.callbackQuery.data);
  const user = await ctx.services.User.getUnique(id);

  await ctx.services.User.update({
    ...user,
    user_group: UserGroup.Unauthorized,
  });

  ctx.reply("User unblocked successfully");
  ctx.api.sendMessage(user.id, "You are now unblocked");
};
