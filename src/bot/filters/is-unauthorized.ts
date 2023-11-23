/* eslint-disable camelcase */
import { UserGroup } from "../const/user-group.ts";

export const isUnauthorized = (userGroup: string) =>
  userGroup === UserGroup.Unauthorized;
