import { createCallbackData } from "callback-data";

export const selectPetrolStationData = createCallbackData(
  "petrol-station-manager",
  {
    id: String,
  },
);
