/* eslint-disable camelcase */
import { UserGroup } from "../const/user-group.js";

export const isUnauthorized = (
  userGroup: string,
): userGroup is UserGroup.Unauthorized => userGroup === UserGroup.Unauthorized;
