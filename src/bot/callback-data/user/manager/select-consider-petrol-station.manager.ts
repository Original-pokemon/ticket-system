import { createCallbackData } from "callback-data";

export const selectConsiderPetrolStationData = createCallbackData(
  "consider-petrol-station-manager",
  {
    id: String,
    statuses: String,
  },
);
