import {
  CachedData,
  Context,
  createContextConstructor,
  SessionData,
} from "#root/bot/context.js";
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
import { CategoryType } from "#root/types/category.js";
import { GroupType } from "#root/types/group.js";
import { ManagerType } from "#root/types/manager.js";
import { PetrolStationType } from "#root/types/petrol-station.js";
import { StatusType } from "#root/types/status.js";
import { TicketType } from "#root/types/ticket.js";
import { UserType } from "#root/types/user.js";
import { dataCacheMiddleware } from "./middlewares/data-cache.js";
import { conversationsFeature } from "./conversations/index.js";
import { UserGroup } from "./const/user-group.js";

type Options = {
  container: Container;
  sessionStorage: StorageAdapter<unknown>;
};

const getSessionKey = (ctx: Omit<Context, "session">) =>
  ctx.chat?.id.toString();

function createEmptyCache<T>(): CachedData<T> {
  return {
    // eslint-disable-next-line unicorn/no-null
    data: null,
    lastUpdate: Date.now(),
  };
}

function initialSessionData(): SessionData {
  return {
    user: {
      id: "",
      user_name: "",
      first_name: "",
      user_group: UserGroup.Unauthorized,
    },
    customData: {},
    // eslint-disable-next-line unicorn/no-null
    selectUser: null,

    // Кэшируемые справочники
    categories: createEmptyCache<CategoryType>(),
    groups: createEmptyCache<GroupType>(),
    statuses: createEmptyCache<StatusType>(),
    petrolStations: createEmptyCache<PetrolStationType>(),
    tickets: createEmptyCache<TicketType>(),
    managers: createEmptyCache<ManagerType>(),
    users: createEmptyCache<UserType>(),
  };
}

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
      initial: initialSessionData,
      storage: sessionStorage,
      getSessionKey,
    }),
  );
  protectedBot.use(authMiddleware());
  protectedBot.use(dataCacheMiddleware());

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
