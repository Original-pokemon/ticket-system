import { isUser } from "#root/bot/filters/index.js";
import { UserGroup } from "#root/bot/const/index.js";
import {
  createPetrolStationKeyboard,
  createTaskPerformerKeyboard,
  createManagerKeyboard,
} from "./index.js";

const Keyboard = {
  [UserGroup.Manager]: createManagerKeyboard,
  [UserGroup.PetrolStation]: createPetrolStationKeyboard,
  [UserGroup.TaskPerformer]: createTaskPerformerKeyboard,
};

export const createUserKeyboard = async (group: string) => {
  if (isUser(group)) {
    return Keyboard[group]();
  }
};
