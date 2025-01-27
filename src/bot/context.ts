import { ServicesType } from "#root/container.js";
import type { Logger } from "#root/logger.js";
import {
  UserType,
  CategoryType,
  GroupType,
  ManagerType,
  PetrolStationType,
  StatusType,
  TicketType,
} from "#root/types/index.js";
import { type Api, Context as DefaultContext, SessionFlavor } from "grammy";
import { Calendar } from "telegram-inline-calendar";

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
  categories: { [key: string]: CategoryType } | null;
  groups: { [key: string]: GroupType } | null;
  statuses: { [key: string]: StatusType } | null;
  petrolStations: { [key: string]: PetrolStationType } | null;
  tickets: { [key: string]: TicketType } | null;
  managers: { [key: string]: ManagerType } | null;
};

type ExtendedContextFlavor = {
  logger: Logger;
  services: ServicesType;
  calendar: Calendar;
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

    calendar: Calendar;

    constructor(update: Update, api: Api, me: UserFromGetMe) {
      super(update, api, me);
      Object.defineProperty(this, "logger", {
        writable: true,
      });

      Object.defineProperty(this, "services", {
        writable: true,
      });

      Object.defineProperty(this, "calendar", {
        writable: true,
      });

      this.services = services;

      this.logger = logger.child({
        update_id: this.update.update_id,
      });

      this.calendar = new Calendar(this.api, {
        date_format: "DD-MM-YYYY",
        start_date: new Date(),
        stop_date: new Date(new Date().getFullYear() + 1, 11, 31),
        initialDate: new Date(),
        language: "ru",
        bot_api: "grammy",
        custom_start_msg: "📅 Выберите крайнюю дату выполнения задачи",
      });
    }
  } as unknown as new (update: Update, api: Api, me: UserFromGetMe) => Context;
}
