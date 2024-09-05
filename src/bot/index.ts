import { Context, createContextConstructor } from "#root/bot/context.js";
import {
  botAdminFeature,
  userFeature,
  unhandledFeature,
  welcomeFeature,
} from "#root/bot/features/index.js";
import { errorHandler } from "#root/bot/handlers/index.js";
import { updateLogger, authMiddleware } from "#root/bot/middlewares/index.js";
import { Container } from "#root/container.js";
import { Bot as TelegramBot, BotConfig, session, StorageAdapter } from "grammy";

import { autoChatAction } from "@grammyjs/auto-chat-action";
import { hydrate } from "@grammyjs/hydrate";
import { hydrateReply, parseMode } from "@grammyjs/parse-mode";
import { sequentialize } from "@grammyjs/runner";
import { hydrateFiles } from "@grammyjs/files";
import { conversationsFeature } from "./conversations/index.js";

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
  const protectedBot = bot.errorBoundary(errorHandler);

  // Middlewares
  bot.api.config.use(parseMode("HTML"));

  if (config.isDev) {
    protectedBot.use(updateLogger());
  }

  bot.api.config.use(hydrateFiles(bot.token));
  protectedBot.use(autoChatAction(bot.api));
  protectedBot.use(hydrateReply);
  protectedBot.use(hydrate());
  protectedBot.use(sequentialize(getSessionKey));
  protectedBot.use(
    session({
      initial: () => ({
        user: {},
        customData: {},
      }),
      storage: sessionStorage,
      getSessionKey,
    }),
  );
  protectedBot.use(authMiddleware());

  // Conversations
  protectedBot.use(conversationsFeature(container));

  // Handlers
  protectedBot.use(welcomeFeature);
  protectedBot.use(botAdminFeature);
  protectedBot.use(userFeature);

  // must be the last handler
  protectedBot.use(unhandledFeature);

  return bot;
}

export type Bot = ReturnType<typeof createBot>;
