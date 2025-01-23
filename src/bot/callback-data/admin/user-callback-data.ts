import { createCallbackData } from "callback-data";

export const unBlockUserData = createCallbackData("unblock", {
  id: String,
});

export const blockUserData = createCallbackData("block", {
  id: String,
});

export const registerUserData = createCallbackData("register", {
  id: String,
});
