import { retrieveTicketData } from "#root/bot/callback-data/index.js";
import { transferTicketData } from "#root/bot/callback-data/user/ticket/transfer-ticket.user.js";
import { UserText } from "#root/bot/const/index.js";
import { InlineKeyboard } from "grammy";

export const considerTicketProfilePanelTaskPerformer = (id: string) =>
  InlineKeyboard.from([
    [
      {
        text: UserText.TicketProfilePanel.ACCEPT_TEXT,
        callback_data: transferTicketData.pack({ id }),
      },
      {
        text: UserText.TicketProfilePanel.RETRIEVE_TEXT,
        callback_data: retrieveTicketData.pack({ id }),
      },
    ],
  ]);
