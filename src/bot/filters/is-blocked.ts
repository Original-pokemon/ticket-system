/* eslint-disable camelcase */
import { UserGroup } from "../const/user-group.ts";

export const isBlocked = (userGroup: string) => userGroup === UserGroup.Blocked;
