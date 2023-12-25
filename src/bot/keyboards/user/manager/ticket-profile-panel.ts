import { deleteTicketData } from "#root/bot/callback-data/user/ticket/delete-ticket.user.ts";
import { editTicketData } from "#root/bot/callback-data/user/ticket/edit-ticket.user.ts";
import { sendTicketData } from "#root/bot/callback-data/user/ticket/send-ticket.user.ts";
import { UserText } from "#root/bot/const/index.ts";
import { InlineKeyboard } from "grammy";

export const ticketProfilePanel = (id: string) =>
  InlineKeyboard.from([
    [
      {
        text: UserText.TicketProfilePanel.SEND_TEXT,
        callback_data: sendTicketData.pack({ id }),
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
