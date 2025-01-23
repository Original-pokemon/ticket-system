import { createCallbackData } from "callback-data";

export const selectPriorityData = createCallbackData("select-priority", {
  id: String,
});

export const selectCategoryData = createCallbackData("select-category", {
  id: String,
});
