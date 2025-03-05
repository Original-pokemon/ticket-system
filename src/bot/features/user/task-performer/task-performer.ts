import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/index.js";
import { Composer } from "grammy";

import {
  retrieveTicketData,
  performedTicketData,
  showCalendarData,
} from "#root/bot/callback-data/index.js";
import {
  retrieveTicketHandler,
  takeTicketHandler,
  showCalendarHandler,
  getDeadlineHandler,
} from "#root/bot/handlers/index.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.callbackQuery(
  retrieveTicketData.filter(),
  logHandle("callback-retrieve-ticket"),
  retrieveTicketHandler,
);

feature.callbackQuery(
  performedTicketData.filter(),
  logHandle("callback-performed-ticket"),
  takeTicketHandler,
);

feature.callbackQuery(
  showCalendarData.filter(),
  logHandle("callback-calendar"),
  showCalendarHandler,
);

feature.callbackQuery(
  /n_./,
  logHandle("callback-set-dead-line"),
  getDeadlineHandler,
);

export { composer as taskPerformerFeature };
