import { Context } from "#root/bot/context.js";
import { TAKE_TICKET_CONVERSATION } from "#root/bot/conversations/index.js";
import { CallbackQueryContext, InlineKeyboard } from "grammy";

import {
  showCalendarData,
  transferTicketData,
} from "#root/bot/callback-data/index.js";

import customParseFormat from "dayjs/plugin/customParseFormat.js";
import dayjs from "dayjs";
import formatDateString from "#root/bot/helpers/format-date.js";

export const takeTicketHandler = async (ctx: CallbackQueryContext<Context>) => {
  await ctx.conversation.enter(TAKE_TICKET_CONVERSATION);
};

export const showCalendarHandler = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const { ticketId } = showCalendarData.unpack(ctx.callbackQuery.data);

  await ctx.deleteMessage();

  ctx.session.customData.ticketId = ticketId;
  ctx.calendar.startNavCalendar(ctx);
};

dayjs.extend(customParseFormat);

export const getDeadlineHandler = async (ctx: Context) => {
  const { session, calendar } = ctx;
  const deadline = calendar.clickButtonCalendar(ctx);

  if (deadline !== -1) {
    const { ticketId } = session.customData;

    if (!ticketId) {
      throw new Error("Ticket id not found");
    }

    session.customData = {};

    const parsedDeadline = dayjs(deadline, "DD-MM-YYYY").toString();
    session.customData.deadline = parsedDeadline;

    const date = formatDateString(parsedDeadline);
    await ctx.reply(`Выбрана дата: ${date}`, {
      reply_markup: InlineKeyboard.from([
        [
          {
            text: "Подтвердить",
            callback_data: transferTicketData.pack({
              id: ticketId,
            }),
          },
        ],
        [
          {
            text: "Выбрать другую дату",
            callback_data: showCalendarData.pack({ ticketId }),
          },
        ],
      ]),
    });
  }
};
