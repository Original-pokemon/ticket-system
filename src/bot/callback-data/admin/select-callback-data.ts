import { createCallbackData } from "callback-data";

export const selectBushData = createCallbackData("bush", {
  id: String,
});

export const selectCategoryAdminData = createCallbackData("category-admin", {
  id: String,
});

export const selectGroupData = createCallbackData("group", {
  id: String,
});

export const selectManagerData = createCallbackData("manager", {
  id: String,
});

export const selectPetrolStationAdminData = createCallbackData(
  "petrol-station-admin",
  {
    id: String,
  },
);

export const selectUserData = createCallbackData("user", {
  id: String,
});
