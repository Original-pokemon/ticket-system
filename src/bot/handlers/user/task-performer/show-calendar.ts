import { showCalendarData } from "#root/bot/callback-data/index.js";
import { Context } from "#root/bot/context.js";
import { CallbackQueryContext } from "grammy";

export const showCalendarHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { ticketId } = showCalendarData.unpack(ctx.callbackQuery.data);

  await ctx.deleteMessage();

  ctx.session.customData.ticketId = ticketId;
  ctx.calendar.startNavCalendar(ctx);
};
