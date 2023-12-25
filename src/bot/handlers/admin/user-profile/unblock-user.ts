import { CallbackQueryContext } from "grammy";
import { AdminText, UserGroup } from "#root/bot/const/index.ts";
import { unBlockUserData } from "#root/bot/callback-data/index.ts";
import { Context } from "#root/bot/context.ts";

export const unblockUserHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { id } = unBlockUserData.unpack(ctx.callbackQuery.data);
  const user = await ctx.services.User.getUnique(id);

  await ctx.services.User.update({
    ...user,
    user_group: UserGroup.Unauthorized,
  });

  await ctx.reply(AdminText.Unblock.USER_UNBLOCK);
  await ctx.api.sendMessage(user.id, AdminText.Unblock.USER_MESSAGE);
};
