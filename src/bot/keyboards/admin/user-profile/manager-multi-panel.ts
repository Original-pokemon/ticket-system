import {
  saveRelationshipData,
  selectManagerData,
} from "#root/bot/callback-data/index.js";
import { AdminText } from "#root/bot/const/index.js";

import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/index.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";

export const createManagersKeyboard = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const managers = await ctx.services.Manager.getAll();
  const { session } = ctx;

  if (!session.selectUser) {
    throw new Error("User not Selected");
  }

  const keyboard = InlineKeyboard.from(
    chunk(
      managers.map(({ user }) => {
        if (user) {
          const { id, user_name: userName } = user;
          const text = session.customData[id.toString()]
            ? `✅${userName}`
            : userName;

          return {
            text,
            callback_data: selectManagerData.pack({
              id: id.toString(),
            }),
          };
        }
        throw new Error("don`t find user information");
      }),
      2,
    ),
  );

  keyboard
    .row()
    .text(
      AdminText.Keyboard.SAVE,
      saveRelationshipData.pack({ id: session.selectUser }),
    );
  return keyboard;
};
