import { InlineKeyboard } from "grammy";
import { TicketType } from "#root/services/index.js";
import { Context } from "../context.js";

type Properties = {
  ctx: Context;
  ticket: TicketType;
};

export const sendManagers = async (
  { ctx, ticket }: Properties,
  text: string,
  markup?: InlineKeyboard,
) => {
  const { petrol_station_id: petrolStationId } = ticket;
  const { managers } =
    await ctx.services.PetrolStation.getUnique(petrolStationId);

  if (!managers) {
    throw new Error("Managers not found");
  }

  const promises = managers.map(async (managerId) => {
    try {
      await ctx.api.sendMessage(managerId, text, { reply_markup: markup });
    } catch (error) {
      ctx.logger.error(
        `Failed to send message to manager ${managerId}: ${error}`,
      );
    }
  });

  await Promise.all(promises);
};
