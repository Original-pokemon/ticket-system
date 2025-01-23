import {
  deleteTicketData,
  transferTicketData,
} from "#root/bot/callback-data/index.js";
import { UserText } from "#root/bot/const/index.js";
import { InlineKeyboard } from "grammy";

export const ticketProfilePanelPetrolSTation = (id: string) =>
  InlineKeyboard.from([
    [
      {
        text: UserText.TicketProfilePanel.SEND_TEXT,
        callback_data: transferTicketData.pack({ id }),
      },
      {
        text: UserText.TicketProfilePanel.DELETE_TEXT,
        callback_data: deleteTicketData.pack({ id }),
      },
    ],
  ]);
