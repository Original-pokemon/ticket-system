import { performedTicketData } from "#root/bot/callback-data/index.ts";
import { UserText } from "#root/bot/const/index.ts";
import { InlineKeyboard } from "grammy";

export const performedTicketProfileTaskPerformer = (id: string) =>
  InlineKeyboard.from([
    [
      {
        text: UserText.TicketProfilePanel.CONSIDER,
        callback_data: performedTicketData.pack({ id }),
      },
    ],
  ]);
