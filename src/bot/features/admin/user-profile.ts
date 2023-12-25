import type { Context } from "#root/bot/context.ts";
import { isBotAdmin } from "#root/bot/filters/index.ts";

import {
  setUpRelationshipHandler,
  unblockUserHandler,
  registerUserHandler,
  blockUserHandler,
  saveCategoryHandler,
  saveRelationshipHandler,
} from "#root/bot/handlers/index.ts";
import { logHandle } from "#root/bot/helpers/logging.ts";
import { Composer } from "grammy";
import { chatAction } from "@grammyjs/auto-chat-action";
import {
  blockUserData,
  registerUserData,
  setRelationshipUserData,
  unBlockUserData,
  selectManagerData,
  selectCategoryAdminData,
  selectPetrolStationAdminData,
} from "#root/bot/callback-data/index.ts";
import { selectPetrolStationsHandler } from "#root/bot/handlers/admin/user-profile/select-petrol-stations.ts";
import { saveRelationshipData } from "#root/bot/callback-data/admin/save-relationship.ts";
import { selectManagersHandler } from "#root/bot/handlers/admin/user-profile/select-managers.ts";

const composer = new Composer<Context>();

const feature = composer.chatType("private").filter(isBotAdmin);

feature.callbackQuery(
  setRelationshipUserData.filter(),
  logHandle("hears-set-up-links"),
  chatAction("typing"),
  setUpRelationshipHandler,
);

feature.callbackQuery(
  blockUserData.filter(),
  logHandle("callbackquery-block-user"),
  chatAction("typing"),
  blockUserHandler,
);

feature.callbackQuery(
  unBlockUserData.filter(),
  logHandle("callbackquery-unblock-user"),
  chatAction("typing"),
  unblockUserHandler,
);

feature.callbackQuery(
  registerUserData.filter(),
  logHandle("callbackquery-register-user"),
  chatAction("typing"),
  registerUserHandler,
);

feature.callbackQuery(
  selectPetrolStationAdminData.filter(),
  logHandle("callbackquery-selext-petrol-station"),
  chatAction("typing"),
  selectPetrolStationsHandler,
);
feature.callbackQuery(
  selectManagerData.filter(),
  logHandle("callbackquery-select-petrol-station"),
  chatAction("typing"),
  selectManagersHandler,
);

feature.callbackQuery(
  saveRelationshipData.filter(),
  logHandle("callbackquery-save-relationship"),
  chatAction("typing"),
  saveRelationshipHandler,
);

feature.callbackQuery(
  selectCategoryAdminData.filter(),
  logHandle("callbackquery-set-category"),
  chatAction("typing"),
  saveCategoryHandler,
);

export { composer as userProfileFeature };
