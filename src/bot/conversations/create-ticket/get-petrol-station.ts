import { selectPetrolStationCreateTicketData } from "#root/bot/callback-data/index.js";
import { UserGroup, UserText } from "#root/bot/const/index.js";
import { Context } from "#root/bot/context.js";
import { Conversation } from "@grammyjs/conversations";

import { chunk } from "#root/bot/helpers/index.js";
import { InlineKeyboard } from "grammy";

type Properties = {
  ctx: Context;
  conversation: Conversation<Context>;
};

const createPetrolStationsKeyboardForManager = async (ctx: Context) => {
  const { services, session } = ctx;
  const { user } = session;
  const { tickets } = await services.Manager.getUnique(user.id);
  const petrolStations = tickets?.map((ticket) => {
    return ticket.petrol_station;
  });

  const users = petrolStations?.length
    ? await services.User.getSelect(petrolStations)
    : [];

  return InlineKeyboard.from(
    chunk(
      users.map(({ user_name: userName, id }) => ({
        text: userName,
        callback_data: selectPetrolStationCreateTicketData.pack({
          id,
        }),
      })),
      2,
    ),
  );
};

const createPetrolStationsKeyboardForSupervisor = async (ctx: Context) => {
  const { services } = ctx;
  const petrolStations = await services.PetrolStation.getAll();

  const usersId = petrolStations.map(({ id }) => id);
  const users = await services.User.getSelect(usersId);

  return InlineKeyboard.from(
    chunk(
      users.map(({ user_name: userName, id }) => ({
        text: userName,
        callback_data: selectPetrolStationCreateTicketData.pack({
          id,
        }),
      })),
      2,
    ),
  );
};

const Keyboard = {
  [UserGroup.Manager]: createPetrolStationsKeyboardForManager,
  [UserGroup.Supervisor]: createPetrolStationsKeyboardForSupervisor,
};

type KeyboardKeys = keyof typeof Keyboard;

export const getPetrolStation = async ({
  ctx,
  conversation,
}: Properties): Promise<[string, Context]> => {
  const userGroup = ctx.session.user.user_group;

  if (!(userGroup in Keyboard)) {
    throw new Error("This group is not supported");
  }

  await ctx.reply(UserText.CreateTicket.PETROL_STATIONS, {
    reply_markup: await Keyboard[userGroup as KeyboardKeys](ctx),
  });

  const petrolStationCtx = await conversation.waitForCallbackQuery(
    selectPetrolStationCreateTicketData.filter(),
  );

  const {
    callbackQuery: { data: petrolStation },
  } = petrolStationCtx;
  const { id: petrolStationId } =
    selectPetrolStationCreateTicketData.unpack(petrolStation);

  return [petrolStationId, petrolStationCtx];
};
