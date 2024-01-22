/* eslint-disable camelcase */
import { isUserHasId } from "grammy-guard";
import { config } from "#root/config.js";
import { UserGroup } from "../const/user-group.js";

export const isBotAdmin = isUserHasId(...config.BOT_ADMIN_USER_ID);

export const isAdmin = (userGroup: string) => userGroup === UserGroup.Admin;
