import type { Context } from "#root/bot/context.ts";
import { logHandle } from "#root/bot/helpers/logging.ts";
import { Composer } from "grammy";

import { chatAction } from "@grammyjs/auto-chat-action";
import { selectTicketData } from "#root/bot/callback-data/user/ticket/select-ticket.user.ts";
import { showTicketHandler } from "#root/bot/handlers/user/select-ticket.ts";
import { sendTicketData } from "#root/bot/callback-data/user/ticket/send-ticket.user.ts";
import { sendTicketHandler } from "#root/bot/handlers/user/send-ticket.ts";
import { managerFeature } from "./manager/manager.ts";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.use(managerFeature);

feature.callbackQuery(
  selectTicketData.filter(),
  logHandle("callbackQuery-show-ticket"),
  chatAction("typing"),
  showTicketHandler,
);

feature.callbackQuery(
  sendTicketData.filter(),
  logHandle("callbackQuery-send-ticket"),
  chatAction("typing"),
  sendTicketHandler,
);

export { composer as userFeature };
