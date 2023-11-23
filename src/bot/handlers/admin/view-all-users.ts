import { AdminText } from "#root/bot/const/text.ts";
import { Context } from "#root/bot/context.ts";
import { createSelectUserKeyboard } from "#root/bot/keyboards/admin/select-user.ts";
import { HearsContext } from "grammy";

export const viewAllUsersCommandHandler = async (ctx: HearsContext<Context>) =>
  ctx.reply(AdminText.AdminCommand.USERS, {
    reply_markup: await createSelectUserKeyboard(ctx),
  });
