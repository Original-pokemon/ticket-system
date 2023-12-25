import { TaskPerformerButtons } from "#root/bot/const/index.ts";
import { chunk } from "#root/bot/helpers/keyboard.ts";
import { Keyboard } from "grammy";

const buttons = Object.values(TaskPerformerButtons);

export const createTaskPerformerKeyboard = async () =>
  Keyboard.from(chunk(buttons, 2));
