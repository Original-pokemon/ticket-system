import { AdminText } from "#root/bot/const/text.ts";
import { Context } from "#root/bot/context.ts";
import { createSelectUserKeyboard } from "#root/bot/keyboards/index.ts";
import { HearsContext } from "grammy";

export const viewAllUsersCommandHandler = async (ctx: HearsContext<Context>) =>
  ctx.reply(AdminText.Admin.USERS, {
    reply_markup: await createSelectUserKeyboard(ctx),
  });
