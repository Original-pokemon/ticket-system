/* eslint-disable camelcase */
import { UserGroup } from "../const/user-group.js";

export const isManager = (string: string): string is UserGroup.Manager =>
  string === UserGroup.Manager;
export const isPetrolStation = (
  string: string,
): string is UserGroup.PetrolStation => string === UserGroup.PetrolStation;
export const isTaskPerformer = (
  string: string,
): string is UserGroup.TaskPerformer => string === UserGroup.TaskPerformer;

export const isSupervisor = (string: string): string is UserGroup.Supervisor =>
  string === UserGroup.Supervisor;

export const isAuthUser = (
  string: string,
): string is
  | UserGroup.TaskPerformer
  | UserGroup.PetrolStation
  | UserGroup.Manager
  | UserGroup.Supervisor =>
  isManager(string) ||
  isPetrolStation(string) ||
  isTaskPerformer(string) ||
  isSupervisor(string);
