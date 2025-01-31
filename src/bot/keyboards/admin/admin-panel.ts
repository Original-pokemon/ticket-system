import { AdminButton, SupervisorButtons } from "#root/bot/const/index.js";
import { chunk } from "#root/bot/helpers/index.js";
import { Keyboard, InlineKeyboard } from "grammy";

import {
  adminShowAllData,
  adminFindUserData,
  showAllTickets,
} from "#root/bot/callback-data/index.js";

const buttons = Object.values(AdminButton);

export const createAdminKeyboard = async () => Keyboard.from(chunk(buttons, 2));

export function createAdminStartMenu() {
  return new InlineKeyboard()
    .text(AdminButton.ShowAll, adminShowAllData.pack({}))
    .row()
    .text(AdminButton.FindUser, adminFindUserData.pack({}))
    .row()
    .text(SupervisorButtons.AllTickets, showAllTickets.pack({}));
}
