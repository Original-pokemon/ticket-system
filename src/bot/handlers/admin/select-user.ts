import { CallbackQueryContext } from "grammy";
import { Context } from "#root/bot/context.ts";
import { selectUserData } from "#root/bot/callback-data/index.ts";
import { viewUserProfileHandler } from "./view-user-profile.ts";

export const selectUserHandler = async (ctx: CallbackQueryContext<Context>) => {
  const { id } = selectUserData.unpack(ctx.callbackQuery.data);

  await viewUserProfileHandler(ctx, ctx.services, id);
};
