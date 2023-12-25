import { PetrolStationButtons } from "#root/bot/const/index.ts";
import { chunk } from "#root/bot/helpers/keyboard.ts";
import { Keyboard } from "grammy";

const buttons = Object.values(PetrolStationButtons);

export const createPetrolStationKeyboard = async () =>
  Keyboard.from(chunk(buttons, 2));
