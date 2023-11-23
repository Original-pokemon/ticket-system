import { selectBushData } from "#root/bot/callback-data/admin/select/select-bush.ts";
import { Context } from "#root/bot/context.ts";
import { chunk } from "#root/bot/helpers/keyboard.ts";
import { InlineKeyboard } from "grammy";

export const createBushKeyboard = async (ctx: Context) => {
  const bushes = await ctx.services.Bush.getAll();

  return InlineKeyboard.from(
    chunk(
      bushes.map((bush) => ({
        text: bush.description,
        callback_data: selectBushData.pack({
          id: bush.id,
        }),
      })),
      2,
    ),
  );
};
