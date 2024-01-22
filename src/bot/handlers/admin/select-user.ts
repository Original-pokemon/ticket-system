import { CallbackQueryContext } from "grammy";
import { Context } from "#root/bot/context.js";
import { selectUserData } from "#root/bot/callback-data/index.js";
import { viewUserProfileHandler } from "./view-user-profile.js";

export const selectUserHandler = async (ctx: CallbackQueryContext<Context>) => {
  const { id } = selectUserData.unpack(ctx.callbackQuery.data);

  await viewUserProfileHandler(ctx, ctx.services, id);
};
