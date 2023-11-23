import { UserGroup } from "#root/bot/const/user-group.ts";
import { ServicesType } from "#root/container.ts";

type Properties = {
  services: ServicesType;
  group: UserGroup;
  id: string;
};

export const deleteHandler = ({ services, group, id }: Properties) => {
  const Services = {
    [UserGroup.Manager]: services.Manager,
    [UserGroup.PetrolStation]: services.PetrolStation,
    [UserGroup.TaskPerformer]: services.TaskPerformer,
    [UserGroup.Admin]: undefined,
    [UserGroup.Blocked]: undefined,
    [UserGroup.Unauthorized]: undefined,
  };

  return Services[group]?.delete(id);
};
