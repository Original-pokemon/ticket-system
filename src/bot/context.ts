import { ServicesType } from "#root/container.ts";
import type { Logger } from "#root/logger.ts";
import { UserType } from "#root/services/user/user-service.ts";
import { type Api, Context as DefaultContext, SessionFlavor } from "grammy";

import type { AutoChatActionFlavor } from "@grammyjs/auto-chat-action";
import { ConversationFlavor } from "@grammyjs/conversations";
import type { HydrateFlavor } from "@grammyjs/hydrate";
import type { ParseModeFlavor } from "@grammyjs/parse-mode";
import { Update, UserFromGetMe } from "@grammyjs/types";
import { FileFlavor } from "@grammyjs/files";

export type SessionData = {
  user: UserType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customData: { [key: string]: any };
  selectUser: string | null;
};

type ExtendedContextFlavor = {
  logger: Logger;
  services: ServicesType;
};

export type Context = ParseModeFlavor<
  FileFlavor<
    HydrateFlavor<
      DefaultContext &
        ExtendedContextFlavor &
        SessionFlavor<SessionData> &
        AutoChatActionFlavor &
        ConversationFlavor
    >
  >
>;

interface Dependencies {
  logger: Logger;
  services: ServicesType;
}

export function createContextConstructor({ logger, services }: Dependencies) {
  return class extends DefaultContext implements ExtendedContextFlavor {
    logger: Logger;

    services: ServicesType;

    constructor(update: Update, api: Api, me: UserFromGetMe) {
      super(update, api, me);
      Object.defineProperty(this, "logger", {
        writable: true,
      });

      Object.defineProperty(this, "services", {
        writable: true,
      });

      this.services = services;

      this.logger = logger.child({
        update_id: this.update.update_id,
      });
    }
  } as unknown as new (update: Update, api: Api, me: UserFromGetMe) => Context;
}
