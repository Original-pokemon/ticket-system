import { isAuthUser } from "#root/bot/filters/index.js";
import { UserGroup } from "#root/bot/const/index.js";
import {
  createPetrolStationKeyboard,
  createTaskPerformerKeyboard,
  createManagerKeyboard,
  createSupervisorKeyboard,
} from "./index.js";

const Keyboard = {
  [UserGroup.Manager]: createManagerKeyboard,
  [UserGroup.PetrolStation]: createPetrolStationKeyboard,
  [UserGroup.TaskPerformer]: createTaskPerformerKeyboard,
  [UserGroup.Supervisor]: createSupervisorKeyboard,
};

export const createUserKeyboard = async (group: string) => {
  if (isAuthUser(group)) {
    return Keyboard[group]();
  }
};
