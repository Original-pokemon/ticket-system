import { isAuthUser } from "#root/bot/filters/index.js";
import { UserGroup } from "#root/bot/const/index.js";
import {
  createPetrolStationKeyboard,
  createTaskPerformerKeyboard,
  createManagerKeyboard,
  createSupervisorKeyboard,
  createPetrolStationInlineKeyboard,
  createManagerInlineKeyboard,
  createTaskPerformerInlineKeyboard,
  createSupervisorInlineKeyboard,
} from "./index.js";
import { createAdminStartMenu } from "../index.js";

const Keyboard = {
  [UserGroup.Manager]: createManagerKeyboard,
  [UserGroup.PetrolStation]: createPetrolStationKeyboard,
  [UserGroup.TaskPerformer]: createTaskPerformerKeyboard,
  [UserGroup.Supervisor]: createSupervisorKeyboard,
};

const InlineKeyboard = {
  [UserGroup.Manager]: createManagerInlineKeyboard,
  [UserGroup.PetrolStation]: createPetrolStationInlineKeyboard,
  [UserGroup.TaskPerformer]: createTaskPerformerInlineKeyboard,
  [UserGroup.Supervisor]: createSupervisorInlineKeyboard,
  [UserGroup.Admin]: createAdminStartMenu,
};

export const createUserKeyboard = async (group: string) => {
  if (isAuthUser(group)) {
    return Keyboard[group]();
  }
};

export const createUserInlineKeyboard = async (group: string) => {
  if (isAuthUser(group)) {
    return InlineKeyboard[group]();
  }
};
