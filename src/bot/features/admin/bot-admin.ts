import type { Context } from "#root/bot/context.js";
import { isBotAdmin } from "#root/bot/filters/index.js";
import {
  viewAllUsersCommandHandler,
  findUserCommandHandler,
  selectUserHandler,
} from "#root/bot/handlers/index.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { Composer } from "grammy";

import { chatAction } from "@grammyjs/auto-chat-action";
import { AdminButton } from "#root/bot/const/admin-buttons.js";
import { selectUserData } from "#root/bot/callback-data/index.js";
import { userProfileFeature } from "./user-profile.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private").filter(isBotAdmin);

feature.use(userProfileFeature);

feature.hears(
  AdminButton.FindUser,
  logHandle("hears-find-user"),
  chatAction("typing"),
  findUserCommandHandler,
);

feature.hears(
  AdminButton.ShowAll,
  logHandle("hears-view-all-user"),
  chatAction("typing"),
  viewAllUsersCommandHandler,
);

feature.hears(
  AdminButton.ConfigureTriggers,
  logHandle("hears-configure-triggers"),
  chatAction("typing"),
);

feature.callbackQuery(
  selectUserData.filter(),
  logHandle("callbackquery-selected-user"),
  chatAction("typing"),
  selectUserHandler,
);

export { composer as botAdminFeature };
