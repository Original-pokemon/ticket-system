import { InlineKeyboard } from "grammy";
import { selectTicketData } from "../callback-data/index.js";

export const createTicketNotificationKeyboard = ({
  ticketId,
  status,
}: {
  ticketId: string;
  status: string;
}) => {
  return InlineKeyboard.from([
    [
      {
        text: "Посмотреть заявку",
        callback_data: selectTicketData.pack({ id: ticketId, status }),
      },
    ],
  ]);
};
