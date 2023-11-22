import { CallbackQueryContext } from "grammy";
import { selectUserData } from "../../callback-data/admin/select/select-user.js";
import { Context } from "../../context.js";
import { viewUserProfileHandler } from "./view-user-profile.js";

export const selectUserHandler = async (ctx: CallbackQueryContext<Context>) => {
  const { id } = selectUserData.unpack(ctx.callbackQuery.data);

  await viewUserProfileHandler(ctx, ctx.services, id);
};
