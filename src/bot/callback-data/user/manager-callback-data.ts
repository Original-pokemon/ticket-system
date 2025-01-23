import { createCallbackData } from "callback-data";

export const selectConsiderPetrolStationData = createCallbackData(
  "consider-petrol-station-manager",
  {
    id: String,
    statuses: String,
  },
);

export const selectPetrolStationCreateTicketData = createCallbackData(
  "select-petrol-station-manager-create-ticket",
  {
    id: String,
  },
);

export const selectPetrolStationData = createCallbackData(
  "petrol-station-manager",
  {
    id: String,
  },
);

export const withdrawTicketData = createCallbackData(
  "withdraw-ticket-callback",
  {
    ticketId: String,
  },
);
