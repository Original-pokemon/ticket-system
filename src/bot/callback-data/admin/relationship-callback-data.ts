import { createCallbackData } from "callback-data";

export const saveRelationshipData = createCallbackData("save-relationship", {
  id: String,
});

export const setRelationshipUserData = createCallbackData("link-user", {
  id: String,
});
