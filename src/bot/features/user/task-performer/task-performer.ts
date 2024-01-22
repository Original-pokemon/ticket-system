import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/index.js";
import { Composer } from "grammy";

import { chatAction } from "@grammyjs/auto-chat-action";
import {
  retrieveTicketData,
  performedTicketData,
} from "#root/bot/callback-data/index.js";
import {
  retrieveTicketHandler,
  viewPetrolStationsFilteredHandler,
  takeTicketHandler,
} from "#root/bot/handlers/index.js";
import { TaskPerformerButtons } from "#root/bot/const/index.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.hears(
  TaskPerformerButtons.TicketsForPerformance,
  logHandle("callback-task-for-performance"),
  chatAction("typing"),
  viewPetrolStationsFilteredHandler,
);

feature.callbackQuery(
  retrieveTicketData.filter(),
  logHandle("callback-retrieve-ticket"),
  chatAction("typing"),
  retrieveTicketHandler,
);

feature.callbackQuery(
  performedTicketData.filter(),
  logHandle("callback-performed-ticket"),
  chatAction("typing"),
  takeTicketHandler,
);

export { composer as taskPerformerFeature };
