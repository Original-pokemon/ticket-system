import { selectCategoryAdminData } from "#root/bot/callback-data/index.js";
import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/index.js";
import { InlineKeyboard } from "grammy";

export const createCategoriesRelationKeyboard = async (ctx: Context) => {
  const {
    services: { TaskPerformer },
    session: {
      selectUser,
      categories: { data },
    },
  } = ctx;

  if (!selectUser) {
    throw new Error("User not Selected");
  }

  if (!data) {
    throw new Error("Categories not found");
  }

  const { category_id: categoryId } = await TaskPerformer.getUnique(selectUser);
  const categoriesArray = Object.values(data);

  return InlineKeyboard.from(
    chunk(
      categoriesArray.map(({ description, id }) => ({
        text: id === categoryId ? `✅${description}` : description,
        callback_data: selectCategoryAdminData.pack({
          id,
        }),
      })),
      2,
    ),
  );
};
