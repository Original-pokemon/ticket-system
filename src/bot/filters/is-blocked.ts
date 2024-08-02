/* eslint-disable camelcase */
import { UserGroup } from "../const/user-group.js";

export const isBlocked = (userGroup: string): userGroup is UserGroup.Blocked =>
  userGroup === UserGroup.Blocked;
