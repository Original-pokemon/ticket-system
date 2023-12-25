import { createCallbackData } from "callback-data";

export const deleteTicketData = createCallbackData("delete-ticket", {
  id: String,
});
