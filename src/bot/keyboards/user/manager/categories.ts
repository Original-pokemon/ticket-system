import { selectCategoryData } from "#root/bot/callback-data/index.js";
import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/index.js";
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
