import { CallbackQueryContext } from "grammy";
import { selectUserData } from "../../callback-data/admin/select/select-user.ts";
import { Context } from "../../context.ts";
import { viewUserProfileHandler } from "./view-user-profile.ts";

export const selectUserHandler = async (ctx: CallbackQueryContext<Context>) => {
  const { id } = selectUserData.unpack(ctx.callbackQuery.data);

  await viewUserProfileHandler(ctx, ctx.services, id);
};
