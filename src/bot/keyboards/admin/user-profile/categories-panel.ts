import { selectCategoryAdminData } from "#root/bot/callback-data/index.js";
import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/index.js";
import { InlineKeyboard } from "grammy";

export const createCategoriesRelationKeyboard = async (ctx: Context) => {
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
        callback_data: selectCategoryAdminData.pack({
          id,
        }),
      })),
      2,
    ),
  );
};
