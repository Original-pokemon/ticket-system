import { selectBushData } from "#root/bot/callback-data/index.js";
import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/index.js";
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
