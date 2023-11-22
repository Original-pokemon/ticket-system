/* eslint-disable camelcase */
import { UserGroup } from "../const/user-group.js";

export const isUnauthorized = (userGroup: string) =>
  userGroup === UserGroup.Unauthorized;
