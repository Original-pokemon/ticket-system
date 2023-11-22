/* eslint-disable camelcase */
import { UserGroup } from "../const/user-group.js";

const isManager = (userGroup: string) => userGroup === UserGroup.Manager;
const isPetrolStation = (userGroup: string) =>
  userGroup === UserGroup.PetrolStation;
const isTaskPerformer = (userGroup: string) =>
  userGroup === UserGroup.TaskPerformer;

export const isUser = (userGroup: string) =>
  isManager(userGroup) ||
  isPetrolStation(userGroup) ||
  isTaskPerformer(userGroup);
