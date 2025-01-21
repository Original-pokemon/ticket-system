import {
  withdrawTicketData,
  retrieveTicketData,
  transferTicketData,
} from "#root/bot/callback-data/index.js";
import { InlineKeyboard } from "grammy";

import { deleteTicketData } from "#root/bot/callback-data/user/ticket/delete-ticket.user.js";
import { editTicketData } from "#root/bot/callback-data/user/ticket/edit-ticket.user.js";
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
