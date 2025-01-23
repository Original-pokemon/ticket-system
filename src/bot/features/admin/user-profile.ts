import type { Context } from "#root/bot/context.js";
import { isBotAdmin } from "#root/bot/filters/index.js";

import {
  setUpRelationshipHandler,
  unblockUserHandler,
  registerUserHandler,
  blockUserHandler,
  saveCategoryHandler,
  saveRelationshipHandler,
  selectPetrolStationsHandler,
  selectManagersHandler,
} from "#root/bot/handlers/index.js";
import { logHandle } from "#root/bot/helpers/logging.js";
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
  saveRelationshipData,
} from "#root/bot/callback-data/index.js";

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
