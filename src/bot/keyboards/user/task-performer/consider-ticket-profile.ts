import {
  retrieveTicketData,
  showCalendarData,
} from "#root/bot/callback-data/index.js";

import { UserText } from "#root/bot/const/index.js";
import { InlineKeyboard } from "grammy";

export const considerTicketProfilePanelTaskPerformer = (id: string) =>
  InlineKeyboard.from([
    [
      {
        text: UserText.TicketProfilePanel.ACCEPT_TEXT,
        callback_data: showCalendarData.pack({ ticketId: id }),
      },
      {
        text: UserText.TicketProfilePanel.RETRIEVE_TEXT,
        callback_data: retrieveTicketData.pack({ id }),
      },
    ],
  ]);
