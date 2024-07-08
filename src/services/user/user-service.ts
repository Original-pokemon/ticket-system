import { UserGroup } from "#root/bot/const/index.js";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export type UserType = {
  id: string;
  user_name: string;
  first_name: string;
  last_name?: string;
  user_group: UserGroup;
  created_at?: string;
};

export class UserService extends BaseService<UserType> {
  constructor() {
    super(ApiRouteKey.User);
  }
}
