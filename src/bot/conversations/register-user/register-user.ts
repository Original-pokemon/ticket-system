import { Context } from "#root/bot/context.js";
import { createConversation } from "@grammyjs/conversations";
import { Container } from "#root/container.js";
import { AdminText, BotText } from "#root/bot/const/index.js";
import { registerUserData } from "#root/bot/callback-data/index.js";
import { handleGroupRegistration } from "./handle-group-registration.js";
import { getUserGroupId } from "./get-user-group-id.js";
import { getUserBushId } from "./get-user-bush-id.js";

export const REGISTER_USER_CONVERSATION = "register-user";

export const registerUserConversation = (container: Container) =>
  createConversation<Context>(async (conversation, ctx) => {
    if (!ctx.callbackQuery?.data) return;
    const { services, logger } = container;
    const { id: userId } = registerUserData.unpack(ctx.callbackQuery.data);
    const [_groupCtx, groupId] = await getUserGroupId({
      ctx,
      conversation,
      services,
    });
    const userLogin = await conversation.form.text();
    const [bushCtx, bushId] = await getUserBushId({
      ctx,
      conversation,
      services,
    });

    await conversation.external(async () => {
      const user = await services.User.getUnique(userId);

      await services.User.update({
        ...user,
        user_name: userLogin,
        user_group: groupId,
      });
      await handleGroupRegistration({
        services,
        group: groupId,
        user,
        bush: bushId,
      });

      const group = await services.Group.getUnique(groupId);

      try {
        await ctx.api.sendMessage(
          userId,
          BotText.Welcome.getUserText(group.description),
        );
      } catch {
        logger.warn("User ID not valid");
      }

      await bushCtx.editMessageText(
        AdminText.Admin.getUserRegText(userLogin, group.description),
      );
    });
  }, REGISTER_USER_CONVERSATION);
