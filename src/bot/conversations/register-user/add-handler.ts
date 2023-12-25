import { UserGroup } from "#root/bot/const/user-group.ts";
import { ServicesType } from "#root/container.ts";

type User = {
  user_id: string;
  bush_id: number;
};

type Properties = {
  services: ServicesType;
  group: UserGroup;
  user: User;
};

export function addHandler({ services, group, user }: Properties) {
  const Services = {
    [UserGroup.Manager]: services.Manager,
    [UserGroup.PetrolStation]: services.PetrolStation,
    [UserGroup.TaskPerformer]: services.TaskPerformer,
    [UserGroup.Admin]: undefined,
    [UserGroup.Blocked]: undefined,
    [UserGroup.Unauthorized]: undefined,
  };

  return Services[group]?.create(user);
}
