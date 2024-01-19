import { createCallbackData } from "callback-data";

export const retrieveTicketData = createCallbackData("retrieve-ticket", {
  id: String,
});
