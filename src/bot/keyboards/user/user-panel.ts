import { isUser } from "#root/bot/filters/index.ts";
import { UserGroup } from "#root/bot/const/index.ts";
import {
  createPetrolStationKeyboard,
  createTaskPerformerKeyboard,
  createManagerKeyboard,
} from "./index.ts";

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
