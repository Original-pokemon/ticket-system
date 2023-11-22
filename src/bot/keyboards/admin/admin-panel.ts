import { AdminButton } from "#root/bot/const/admin-buttons.js";
import { chunk } from "#root/bot/helpers/keyboard.js";
import { Keyboard } from "grammy";

const buttons = Object.values(AdminButton);

export const createAdminKeyboard = async () => Keyboard.from(chunk(buttons, 2));
