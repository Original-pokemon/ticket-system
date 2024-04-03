import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { Composer } from "grammy";

import { Container } from "#root/container.js";
import { conversations } from "@grammyjs/conversations";
import { logger } from "#root/logger.js";
import { findUserConversation } from "./find-user.js";
import {
  createTicketConversation,
  editTicketConversation,
  registerUserConversation,
  takeTicketConversation,
} from "./index.js";

const useConversation = (container: Container) => {
  const composer = new Composer<Context>();

  const feature = composer.errorBoundary((error) => {
    return logger.error(error);
  }, logHandle("errorBoundary-conversations"));

  feature.use(conversations());

  feature.use(findUserConversation(container));
  feature.use(registerUserConversation(container));
  feature.use(createTicketConversation(container));
  feature.use(editTicketConversation(container));
  feature.use(takeTicketConversation(container));

  return composer;
};

export { useConversation as conversationsFeature };
