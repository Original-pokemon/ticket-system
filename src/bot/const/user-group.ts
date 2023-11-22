// eslint-disable-next-line no-shadow
export enum UserGroup {
  Admin = "admin",
  Unauthorized = "unauthorized",
  Blocked = "blocked",
  Manager = "manager",
  PetrolStation = "petrolstation",
  TaskPerformer = "taskperformer",
}

export const isUserGroup = (group: string): group is UserGroup => {
  return Object.values(UserGroup).includes(group as UserGroup);
};
