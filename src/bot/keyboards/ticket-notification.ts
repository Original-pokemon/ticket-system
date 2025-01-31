import { InlineKeyboard } from "grammy";
import { selectTicketData } from "../callback-data/index.js";

export const createTicketNotificationKeyboard = ({
  ticketId,
}: {
  ticketId: string;
}) => {
  return InlineKeyboard.from([
    [
      {
        text: "Посмотреть заявку",
        callback_data: selectTicketData.pack({ id: ticketId }),
      },
    ],
  ]);
};
