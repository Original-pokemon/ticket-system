import {
  withdrawTicketData,
  retrieveTicketData,
  transferTicketData,
  editTicketData,
  deleteTicketData,
} from "#root/bot/callback-data/index.js";
import { InlineKeyboard } from "grammy";

import { UserText } from "#root/bot/const/index.js";

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

export const createReviewTaskCompletionKeyboard = (ticketId: string) =>
  InlineKeyboard.from([
    [
      {
        text: "Отметить исполненой",
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

export const ticketProfilePanelManager = (id: string) =>
  InlineKeyboard.from([
    [
      {
        text: UserText.TicketProfilePanel.SEND_TEXT,
        callback_data: transferTicketData.pack({ id }),
      },
    ],
    [
      {
        text: UserText.TicketProfilePanel.EDIT_TEXT,
        callback_data: editTicketData.pack({ id }),
      },
    ],
    [
      {
        text: UserText.TicketProfilePanel.DELETE_TEXT,
        callback_data: deleteTicketData.pack({ id }),
      },
    ],
  ]);
