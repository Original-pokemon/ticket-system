import { createCallbackData } from "callback-data";

export const showPetrolStationsData = createCallbackData(
  "show-petrol-stations",
  {
    status: String,
  },
);
