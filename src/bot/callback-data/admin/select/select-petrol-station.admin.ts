import { createCallbackData } from "callback-data";

export const selectPetrolStationAdminData = createCallbackData(
  "petrol-station-admin",
  {
    id: String,
  },
);
