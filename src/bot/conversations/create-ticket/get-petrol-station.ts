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
  const {
    petrolStations: { data: petrolStations },
  } = session;

  if (!petrolStations) {
    throw new Error("Petrol stations not found");
  }

  const petrolStationsId = Object.values(petrolStations).map(
    (petrolStation) => petrolStation.id,
  );

  const users = petrolStationsId?.length
    ? await services.User.getSelect(petrolStationsId)
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

  const keyboard = await Keyboard[userGroup as KeyboardKeys](ctx);

  await ctx.reply(UserText.CreateTicket.PETROL_STATIONS, {
    reply_markup: keyboard,
  });

  const cancelCallback = "cancel_creation";

  const petrolStationCtx = await conversation.waitForCallbackQuery(
    selectPetrolStationCreateTicketData.filter(),
    {
      otherwise: async (answerCtx) => {
        if (answerCtx.hasCallbackQuery(cancelCallback)) {
          await answerCtx.conversation.exit();

          await answerCtx.editMessageText(
            UserText.CreateTicket.Interrupt.BEEN_INTERRUPTED,
          );
        } else {
          await answerCtx.reply(UserText.CreateTicket.PETROL_STATIONS, {
            reply_markup: keyboard,
          });
          await ctx.reply(UserText.CreateTicket.Interrupt.SELECT_STATION, {
            reply_markup: InlineKeyboard.from([
              [
                {
                  text: UserText.CreateTicket.Interrupt.ABORT,
                  callback_data: cancelCallback,
                },
              ],
            ]),
          });
        }
      },
      drop: true,
    },
  );

  const {
    callbackQuery: { data: petrolStation },
  } = petrolStationCtx;
  const { id: petrolStationId } =
    selectPetrolStationCreateTicketData.unpack(petrolStation);

  return [petrolStationId, petrolStationCtx];
};
