import { createCallbackData } from "callback-data";

export const selectTicketData = createCallbackData("select-ticket", {
  id: String,
  status: String,
});
