import { selectCategoryData } from "#root/bot/callback-data/admin/select/select-category.js";
import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/keyboard.js";
import { InlineKeyboard } from "grammy";

export const createCategoriesKeyboard = async (ctx: Context) => {
  const {
    services: { TaskPerformer, Category },
    session: { selectUser },
  } = ctx;

  if (!selectUser) {
    throw new Error("User not Selected");
  }

  const { category_id: categoryId } = await TaskPerformer.getUnique(selectUser);
  const categories = await Category.getAll();

  return InlineKeyboard.from(
    chunk(
      categories.map(({ description, id }) => ({
        text: id === categoryId ? `✅${description}` : description,
        callback_data: selectCategoryData.pack({
          id,
        }),
      })),
      2,
    ),
  );
};
