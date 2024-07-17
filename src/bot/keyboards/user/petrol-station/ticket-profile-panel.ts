import { transferTicketData } from "#root/bot/callback-data/user/ticket/transfer-ticket.user.js";
import { UserText } from "#root/bot/const/index.js";
import { InlineKeyboard } from "grammy";

export const ticketProfilePanelPetrolSTation = (id: string) =>
  InlineKeyboard.from([
    [
      {
        text: UserText.TicketProfilePanel.SEND_TEXT,
        callback_data: transferTicketData.pack({ id }),
      },
    ],
  ]);
