import { createCallbackData } from "callback-data";

export const withdrawTicketData = createCallbackData(
  "withdraw-ticket-callback",
  {
    ticketId: String,
  },
);
