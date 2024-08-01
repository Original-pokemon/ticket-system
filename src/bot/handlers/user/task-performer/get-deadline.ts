import {
  showCalendarData,
  transferTicketData,
} from "#root/bot/callback-data/index.js";
import { Context } from "#root/bot/context.js";
import { InlineKeyboard } from "grammy";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import dayjs from "dayjs";
import formatDateString from "#root/bot/helpers/format-date.js";

dayjs.extend(customParseFormat);

export const getDeadlineHandler = async (ctx: Context) => {
  const deadline = ctx.calendar.clickButtonCalendar(ctx);
  const { ticketId } = ctx.session.customData;

  if (!ticketId) {
    throw new Error("Ticket id not found");
  }

  ctx.session.customData = {};

  if (deadline !== -1) {
    const parsedDeadline = dayjs(deadline, "DD-MM-YYYY").toString();
    ctx.session.customData.deadline = parsedDeadline;

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
