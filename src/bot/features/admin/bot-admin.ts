import type { Context } from "#root/bot/context.js";
import { isBotAdmin } from "#root/bot/filters/index.js";
import {
  viewAllUsersCommandHandler,
  findUserCommandHandler,
  selectUserHandler,
  viewAllGroupsCommandHandler,
} from "#root/bot/handlers/index.js";
import { logHandle } from "#root/bot/helpers/index.js";
import { Composer } from "grammy";

import { chatAction } from "@grammyjs/auto-chat-action";
import {
  adminFindUserData,
  adminShowAllData,
  adminShowTickets,
  selectUserData,
} from "#root/bot/callback-data/index.js";
import { userProfileFeature } from "./user-profile.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private").filter(isBotAdmin);

feature.use(userProfileFeature);

feature.callbackQuery(
  adminFindUserData.filter(),
  logHandle("callback-find-user-admin"),
  chatAction("typing"),
  findUserCommandHandler,
);

feature.callbackQuery(
  adminShowAllData.filter(),
  logHandle("callback-view-all-groups-admin"),
  viewAllGroupsCommandHandler,
);

feature.callbackQuery(
  adminShowTickets.filter(),
  logHandle("callback-view-all-user-admin"),
  viewAllUsersCommandHandler,
);

feature.callbackQuery(
  selectUserData.filter(),
  logHandle("callbackquery-selected-user"),
  chatAction("typing"),
  selectUserHandler,
);

export { composer as botAdminFeature };
