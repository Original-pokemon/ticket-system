import { createCallbackData } from "callback-data";

export const selectUserData = createCallbackData("user", {
  id: String,
});
