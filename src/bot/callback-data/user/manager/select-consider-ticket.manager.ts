import { createCallbackData } from "callback-data";

export const selectConsiderTicketData = createCallbackData(
  "consider-ticket-manager",
  {
    id: String,
    status: Number,
  },
);
