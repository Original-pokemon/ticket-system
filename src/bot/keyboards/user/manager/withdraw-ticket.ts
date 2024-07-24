import { withdrawTicketData } from "#root/bot/callback-data/index.js";
import { InlineKeyboard } from "grammy";

export const createWithdrawTicketKeyboard = (ticketId: string) =>
  InlineKeyboard.from([
    [
      {
        text: "Отозвать заявку",
        callback_data: withdrawTicketData.pack({
          ticketId,
        }),
      },
    ],
  ]);
