import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/index.js";
import { Composer } from "grammy";

import { chatAction } from "@grammyjs/auto-chat-action";
import {
  deleteTicketHandler,
  editTicketHandler,
  withdrawTicketHandler,
} from "#root/bot/handlers/index.js";
import {
  editTicketData,
  deleteTicketData,
  withdrawTicketData,
} from "#root/bot/callback-data/index.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.callbackQuery(
  editTicketData.filter(),
  logHandle("callbackQuery-edit-ticket"),
  chatAction("typing"),
  editTicketHandler,
);

feature.callbackQuery(
  deleteTicketData.filter(),
  logHandle("callbackQuery-delete-ticket"),
  chatAction("typing"),
  deleteTicketHandler,
);

feature.callbackQuery(
  withdrawTicketData.filter(),
  logHandle("callbackQuery-withdraw-ticket"),
  chatAction("typing"),
  withdrawTicketHandler,
);

export { composer as managerFeature };
