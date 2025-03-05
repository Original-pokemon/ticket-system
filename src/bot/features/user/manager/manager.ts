import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/index.js";
import { Composer } from "grammy";

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
  editTicketHandler,
);

feature.callbackQuery(
  deleteTicketData.filter(),
  logHandle("callbackQuery-delete-ticket"),
  deleteTicketHandler,
);

feature.callbackQuery(
  withdrawTicketData.filter(),
  logHandle("callbackQuery-withdraw-ticket"),
  withdrawTicketHandler,
);

export { composer as managerFeature };
