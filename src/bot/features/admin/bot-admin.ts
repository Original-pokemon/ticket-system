import type { Context } from "#root/bot/context.ts";
import { isBotAdmin } from "#root/bot/filters/index.ts";
import {
  viewAllUsersCommandHandler,
  findUserCommandHandler,
  selectUserHandler,
} from "#root/bot/handlers/index.ts";
import { logHandle } from "#root/bot/helpers/index.ts";
import { Composer } from "grammy";

import { chatAction } from "@grammyjs/auto-chat-action";
import { AdminButton } from "#root/bot/const/buttons/admin-buttons.ts";
import { selectUserData } from "#root/bot/callback-data/index.ts";
import { userProfileFeature } from "./user-profile.ts";

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
