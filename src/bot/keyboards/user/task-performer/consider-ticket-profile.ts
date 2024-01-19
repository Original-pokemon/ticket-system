import { retrieveTicketData } from "#root/bot/callback-data/index.ts";
import { sendTicketData } from "#root/bot/callback-data/user/ticket/send-ticket.user.ts";
import { UserText } from "#root/bot/const/index.ts";
import { InlineKeyboard } from "grammy";

export const considerTicketProfilePanelTaskPerformer = (id: string) =>
  InlineKeyboard.from([
    [
      {
        text: UserText.TicketProfilePanel.ACCEPT_TEXT,
        callback_data: sendTicketData.pack({ id }),
      },
      {
        text: UserText.TicketProfilePanel.RETRIEVE_TEXT,
        callback_data: retrieveTicketData.pack({ id }),
      },
    ],
  ]);
