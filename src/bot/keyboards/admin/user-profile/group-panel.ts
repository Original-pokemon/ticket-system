import { selectGroupData } from "#root/bot/callback-data/admin/select/select-group.ts";
import { Context } from "#root/bot/context.ts";
import { chunk } from "#root/bot/helpers/keyboard.ts";
import { InlineKeyboard } from "grammy";

export const createGroupKeyboard = async (ctx: Context) => {
  const groups = await ctx.services.Group.getAll();

  return InlineKeyboard.from(
    chunk(
      groups.map((group) => ({
        text: group.description,
        callback_data: selectGroupData.pack({
          id: group.id,
        }),
      })),
      2,
    ),
  );
};
