import { selectPriorityData } from "#root/bot/callback-data/index.ts";
import { Context } from "#root/bot/context.ts";
import { chunk } from "#root/bot/helpers/index.ts";
import { InlineKeyboard } from "grammy";

export const createPriorityKeyboard = async (ctx: Context) => {
  const priorities = await ctx.services.Priority.getAll();

  return InlineKeyboard.from(
    chunk(
      priorities.map(({ description, id }) => ({
        text: description,
        callback_data: selectPriorityData.pack({
          id,
        }),
      })),
      2,
    ),
  );
};
