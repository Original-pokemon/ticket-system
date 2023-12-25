import { createCallbackData } from "callback-data";

export const selectTicketPropertyData = createCallbackData(
  "select-ticket-property",
  {
    id: String,
  },
);
