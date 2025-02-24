import { createCallbackData } from "callback-data";

export const showAllTickets = createCallbackData("show-all-tickets", {});

export const deleteTicketData = createCallbackData("delete-ticket", {
  id: String,
});

export const editTicketData = createCallbackData("edit-ticket", {
  id: String,
});

export const selectTicketData = createCallbackData("select-ticket", {
  id: String,
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

export const SelectTicketScene = {
  Status: "status",
  PetrolStation: "petrol_station",
  Ticket: "Ticket",
} as const;

export const selectTicketsData = createCallbackData("select-tickets", {
  scene: String,
  availableStatuses: String,
  selectStatusId: String,
  selectPetrolStationId: String,
  pageIndex: Number,
});
