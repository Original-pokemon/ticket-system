import { selectPetrolStationData } from "#root/bot/callback-data/index.js";
import { UserText } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { Conversation } from "@grammyjs/conversations";
import { createPetrolStationsKeyboard } from "#root/bot/keyboards/index.js";

type Properties = {
  ctx: Context;
  conversation: Conversation<Context>;
};

export const getPetrolStation = async ({
  ctx,
  conversation,
}: Properties): Promise<[string, Context]> => {
  await ctx.reply(UserText.CreateTicket.PETROL_STATIONS, {
    reply_markup: await createPetrolStationsKeyboard(ctx),
  });

  const petrolStationCtx = await conversation.waitForCallbackQuery([
    selectPetrolStationData.filter(),
  ]);

  const {
    callbackQuery: { data: petrolStation },
  } = petrolStationCtx;
  const { id: petrolStationId } = selectPetrolStationData.unpack(petrolStation);

  return [petrolStationId, petrolStationCtx];
};
