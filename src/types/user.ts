import { UserGroup } from "#root/bot/const/user-group.js";

export type UserType = {
  id: string;
  user_name: string;
  login?: string;
  first_name: string;
  last_name?: string;
  user_group: UserGroup;
  created_at?: string;
};
