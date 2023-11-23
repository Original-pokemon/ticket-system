import { Context, createContextConstructor } from "#root/bot/context";
import {
  botAdminFeature,
  unhandledFeature,
  welcomeFeature,
} from "#root/bot/features/index.ts";
import { errorHandler } from "#root/bot/handlers/index.ts";
import { updateLogger, authMiddleware } from "#root/bot/middlewares/index.ts";
import { Container } from "#root/container.ts";
import { Bot as TelegramBot, BotConfig, session, StorageAdapter } from "grammy";

import { autoChatAction } from "@grammyjs/auto-chat-action";
import { hydrate } from "@grammyjs/hydrate";
import { hydrateReply, parseMode } from "@grammyjs/parse-mode";
import { sequentialize } from "@grammyjs/runner";
import { conversations } from "@grammyjs/conversations";
import {
  registerUserConversation,
  findUserConversation,
} from "./conversations/index.ts";

type Options = {
  container: Container;
  sessionStorage: StorageAdapter<unknown>;
};

const getSessionKey = (ctx: Omit<Context, "session">) =>
  ctx.chat?.id.toString();

export function createBot(
  token: string,
  options: Options,
  botConfig?: Omit<BotConfig<Context>, "ContextConstructor">,
) {
  const { container, sessionStorage } = options;
  const { config } = container;
  const bot = new TelegramBot(token, {
    ...botConfig,
    ContextConstructor: createContextConstructor(container),
  });

  // Middlewares
  bot.api.config.use(parseMode("HTML"));

  if (config.isDev) {
    bot.use(updateLogger());
  }

  bot.use(autoChatAction(bot.api));
  bot.use(hydrateReply);
  bot.use(hydrate());
  bot.use(sequentialize(getSessionKey));
  bot.use(
    session({
      initial: () => ({
        user: {},
        customData: {},
      }),
      storage: sessionStorage,
      getSessionKey,
    }),
  );
  bot.use(conversations());
  bot.use(findUserConversation(container));
  bot.use(registerUserConversation(container));
  bot.use(authMiddleware());

  // Handlers
  bot.use(welcomeFeature);
  bot.use(botAdminFeature);

  // must be the last handler
  bot.use(unhandledFeature);

  if (config.isDev) {
    bot.catch(errorHandler);
  }

  return bot;
}

export type Bot = ReturnType<typeof createBot>;
