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
  selectPetrolStationData,
  selectManagerData,
  selectCategoryData,
} from "#root/bot/callback-data/index.ts";
import { selectPetrolStationHandler } from "#root/bot/handlers/admin/user-profile/select-petrol-station.ts";
import { saveRelationshipData } from "#root/bot/callback-data/admin/save-relationship.ts";
import { selectManagerHandler } from "#root/bot/handlers/admin/user-profile/select-manager.ts";

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
  selectPetrolStationData.filter(),
  logHandle("callbackquery-selext-petrol-station"),
  chatAction("typing"),
  selectPetrolStationHandler,
);
feature.callbackQuery(
  selectManagerData.filter(),
  logHandle("callbackquery-selext-petrol-station"),
  chatAction("typing"),
  selectManagerHandler,
);

feature.callbackQuery(
  saveRelationshipData.filter(),
  logHandle("callbackquery-save-relationship"),
  chatAction("typing"),
  saveRelationshipHandler,
);

feature.callbackQuery(
  selectCategoryData.filter(),
  logHandle("callbackquery-set-category"),
  chatAction("typing"),
  saveCategoryHandler,
);

export { composer as userProfileFeature };
