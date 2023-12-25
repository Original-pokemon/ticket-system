/* eslint-disable camelcase */
import { UserGroup } from "../const/user-group.ts";

export const isManager = (string: string): string is UserGroup.Manager =>
  string === UserGroup.Manager;
export const isPetrolStation = (
  string: string,
): string is UserGroup.PetrolStation => string === UserGroup.PetrolStation;
export const isTaskPerformer = (
  string: string,
): string is UserGroup.TaskPerformer => string === UserGroup.TaskPerformer;

export const isUser = (
  string: string,
): string is
  | UserGroup.TaskPerformer
  | UserGroup.PetrolStation
  | UserGroup.Manager =>
  isManager(string) || isPetrolStation(string) || isTaskPerformer(string);
