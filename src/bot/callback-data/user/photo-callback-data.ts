import { createCallbackData } from "callback-data";

export const deletePhotoData = createCallbackData("delete-photo", {
  id: String,
});

export const savePhotoCallBackData = "savePhoto";
