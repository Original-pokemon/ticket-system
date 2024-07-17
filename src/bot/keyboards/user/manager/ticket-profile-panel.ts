import { deleteTicketData } from "#root/bot/callback-data/user/ticket/delete-ticket.user.js";
import { editTicketData } from "#root/bot/callback-data/user/ticket/edit-ticket.user.js";
import { transferTicketData } from "#root/bot/callback-data/user/ticket/transfer-ticket.user.js";
import { UserText } from "#root/bot/const/index.js";
import { InlineKeyboard } from "grammy";

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
