import { createCallbackData } from "callback-data";

export const showCalendarData = createCallbackData("show-calendar", {
  ticketId: String,
});

export const retrieveTicketData = createCallbackData("retrieve-ticket", {
  id: String,
});

export const performedTicketData = createCallbackData("performed-ticket", {
  id: String,
});
