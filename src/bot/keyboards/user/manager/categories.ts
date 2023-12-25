import { selectCategoryData } from "#root/bot/callback-data/index.ts";
import { Context } from "#root/bot/context.ts";
import { chunk } from "#root/bot/helpers/index.ts";
import { InlineKeyboard } from "grammy";

export const createCategoryKeyboard = async (ctx: Context) => {
  const categories = await ctx.services.Category.getAll();

  return InlineKeyboard.from(
    chunk(
      categories.map(({ description, id }) => ({
        text: description,
        callback_data: selectCategoryData.pack({
          id,
        }),
      })),
      2,
    ),
  );
};
