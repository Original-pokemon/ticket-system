import {
  saveRelationshipData,
  selectCategoryAdminData,
} from "#root/bot/callback-data/index.js";
import { AdminText } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/index.js";
import { InlineKeyboard } from "grammy";

export const createCategoriesRelationKeyboard = async (ctx: Context) => {
  const {
    session: {
      selectUser,
      categories: { data },
      customData,
    },
  } = ctx;

  if (!selectUser) {
    throw new Error("User not Selected");
  }

  if (!data) {
    throw new Error("Categories not found");
  }

  const categoriesArray = Object.values(data);

  const keyboard = InlineKeyboard.from(
    chunk(
      categoriesArray.map(({ description, id }) => ({
        text: customData[id.toString()] ? `✅${description}` : description,
        callback_data: selectCategoryAdminData.pack({
          id,
        }),
      })),
      2,
    ),
  );

  keyboard
    .row()
    .text(
      AdminText.Keyboard.SAVE,
      saveRelationshipData.pack({ id: selectUser }),
    );

  return keyboard;
};
