import { InlineKeyboard } from "grammy";
import { chunk } from "#root/bot/helpers/index.js";
import { Context } from "#root/bot/context.js";
import { selectUserData } from "#root/bot/callback-data/index.js";

export const createSelectUserKeyboard = async (ctx: Context) => {
  const users = await ctx.services.User.getAll();

  return InlineKeyboard.from(
    chunk(
      users.map((user) => ({
        text: user.user_name,
        callback_data: selectUserData.pack({
          id: user.id,
        }),
      })),
      2,
    ),
  );
};
