import { UserGroup } from "#root/bot/const/user-group.ts";
import { isUser } from "#root/bot/filters/is-user.ts";
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
