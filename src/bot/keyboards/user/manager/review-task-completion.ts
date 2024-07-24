import {
  retrieveTicketData,
  transferTicketData,
} from "#root/bot/callback-data/index.js";
import { InlineKeyboard } from "grammy";

export const createReviewTaskCompletionKeyboard = (ticketId: string) =>
  InlineKeyboard.from([
    [
      {
        text: "Принять заявку",
        callback_data: transferTicketData.pack({
          id: ticketId,
        }),
      },
    ],
    [
      {
        text: "Возообновить работу заявки",
        callback_data: retrieveTicketData.pack({
          id: ticketId,
        }),
      },
    ],
  ]);
