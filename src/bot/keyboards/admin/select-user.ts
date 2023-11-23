import { InlineKeyboard } from "grammy";
import { chunk } from "#root/bot/helpers/keyboard.ts";
import { selectUserData } from "../../callback-data/admin/select/select-user.ts";
import { Context } from "../../context.ts";

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
