import { UserGroup } from "#root/bot/const/user-group.js";
import { ServicesType } from "#root/container.js";

type User = {
  id: string;
  bush_id: string;
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
    [UserGroup.Supervisor]: undefined,
    [UserGroup.Admin]: undefined,
    [UserGroup.Blocked]: undefined,
    [UserGroup.Unauthorized]: undefined,
  };

  return Services[group]?.create(user);
}
