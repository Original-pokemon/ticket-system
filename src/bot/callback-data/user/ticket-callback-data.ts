import { createCallbackData } from "callback-data";

export const deleteTicketData = createCallbackData("delete-ticket", {
  id: String,
});

export const editTicketData = createCallbackData("edit-ticket", {
  id: String,
});

export const selectTicketData = createCallbackData("select-ticket", {
  id: String,
  status: String,
});

export const transferTicketData = createCallbackData("transfer-ticket", {
  id: String,
});

export const selectTicketPropertyData = createCallbackData(
  "select-ticket-property",
  {
    id: String,
  },
);
