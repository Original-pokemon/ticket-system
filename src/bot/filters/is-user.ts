/* eslint-disable camelcase */
import { UserGroup } from "../const/user-group.ts";

const isManager = (string: string): string is UserGroup.Manager =>
  string === UserGroup.Manager;
const isPetrolStation = (string: string): string is UserGroup.PetrolStation =>
  string === UserGroup.PetrolStation;
const isTaskPerformer = (string: string): string is UserGroup.TaskPerformer =>
  string === UserGroup.TaskPerformer;

export const isUser = (
  string: string,
): string is
  | UserGroup.TaskPerformer
  | UserGroup.PetrolStation
  | UserGroup.Manager =>
  isManager(string) || isPetrolStation(string) || isTaskPerformer(string);
