import { isUserGroup } from "#root/bot/const/user-group.ts";
import { isUnauthorized } from "#root/bot/filters/index.ts";
import { ServicesType } from "#root/container.ts";
import { UserType } from "#root/services/user/user-service.ts";
import { logger } from "#root/logger.ts";
import { deleteHandler } from "./delete-handler.ts";
import { addHandler } from "./add-handler.ts";

type Properties = {
  services: ServicesType;
  group: string;
  user: UserType;
  bush: number;
};

export const handleGroupRegistration = async ({
  services,
  group,
  user: { user_group: userGroup, id },
  bush,
}: Properties) => {
  if (isUserGroup(group) && isUserGroup(userGroup)) {
    const stringId = id.toString();

    if (isUnauthorized(userGroup)) {
      await addHandler({
        services,
        group,
        user: {
          user_id: stringId,
          bush_id: bush,
        },
      });
    } else {
      try {
        await deleteHandler({ services, group: userGroup, id: stringId });
      } catch {
        logger.warn(`Failed to delete user ${stringId} in ${group}`);
      }

      await addHandler({
        services,
        group,
        user: {
          user_id: stringId,
          bush_id: bush,
        },
      });
    }
  }
};
