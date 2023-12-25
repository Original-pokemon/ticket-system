import { selectPetrolStationData } from "#root/bot/callback-data/index.ts";
import { UserText } from "#root/bot/const/index.ts";
import { Context } from "#root/bot/context.ts";
import { Conversation } from "@grammyjs/conversations";
import { createPetrolStationsKeyboard } from "#root/bot/keyboards/index.ts";

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
  const { id: bushId } = selectPetrolStationData.unpack(petrolStation);

  return [bushId, petrolStationCtx];
};
