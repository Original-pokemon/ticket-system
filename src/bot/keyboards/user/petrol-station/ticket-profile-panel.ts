import { sendTicketData } from "#root/bot/callback-data/user/ticket/send-ticket.user.ts";
import { UserText } from "#root/bot/const/index.ts";
import { InlineKeyboard } from "grammy";

export const ticketProfilePanelPetrolSTation = (id: string) =>
  InlineKeyboard.from([
    [
      {
        text: UserText.TicketProfilePanel.SEND_TEXT,
        callback_data: sendTicketData.pack({ id }),
      },
    ],
  ]);
