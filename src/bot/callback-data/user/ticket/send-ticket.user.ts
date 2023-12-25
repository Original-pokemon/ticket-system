import { createCallbackData } from "callback-data";

export const sendTicketData = createCallbackData("send-ticket", {
  id: String,
});
