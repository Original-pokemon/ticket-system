import { AdminText } from "#root/bot/const/text.js";
import { Context } from "#root/bot/context.js";
import { createSelectUserKeyboard } from "#root/bot/keyboards/admin/select-user.js";
import { HearsContext } from "grammy";

export const viewAllUsersCommandHandler = async (ctx: HearsContext<Context>) =>
  ctx.reply(AdminText.AdminCommand.USERS, {
    reply_markup: await createSelectUserKeyboard(ctx),
  });
