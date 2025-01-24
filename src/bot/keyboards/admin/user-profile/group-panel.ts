import { selectGroupData } from "#root/bot/callback-data/index.js";
import { Context } from "#root/bot/context.js";
import { chunk } from "#root/bot/helpers/index.js";
import { InlineKeyboard } from "grammy";

export const createGroupKeyboard = async (ctx: Context) => {
  const { gropes } = ctx.session;

  if (!gropes) {
    throw new Error("Groups not found");
  }
  const groupsArray = Object.values(gropes);

  return InlineKeyboard.from(
    chunk(
      groupsArray.map((group) => ({
        text: group.description,
        callback_data: selectGroupData.pack({
          id: group.id,
        }),
      })),
      2,
    ),
  );
};
