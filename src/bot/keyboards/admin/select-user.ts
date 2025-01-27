import { getPageKeyboard, paginateItems } from "#root/bot/helpers/index.js";
import { Context } from "#root/bot/context.js";
import {
  adminShowTickets,
  selectUserData,
} from "#root/bot/callback-data/index.js";
import { CallbackQueryContext } from "grammy";

export const createSelectUserKeyboard = async (
  ctx: CallbackQueryContext<Context>,
) => {
  const {
    callbackQuery: { data },
    session,
    services,
  } = ctx;

  const { pageIndex, groupId } = adminShowTickets.unpack(data);

  if (!session.users) {
    const group = await services.Group.getUnique(groupId);
    const usersIdList = group.users || [];
    const users = await services.User.getSelect(usersIdList);
    const usersMap = Object.fromEntries(users.map((user) => [user.id, user]));
    session.users = usersMap;
  }

  const usersArray = Object.values(session.users);

  const usersPages = paginateItems(usersArray, 20);

  const pageItems = usersPages[pageIndex].map((user) => ({
    text: user.user_name,
    callback_data: selectUserData.pack({
      id: user.id,
    }),
  }));

  const keyboard = getPageKeyboard(
    pageItems,
    pageIndex,
    usersPages.length,
    adminShowTickets,
    {
      groupId,
    },
  );

  return keyboard;
};
