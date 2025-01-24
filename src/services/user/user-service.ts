import { UserType } from "#root/types/index.js";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class UserService extends BaseService<UserType> {
  constructor() {
    super(ApiRouteKey.User);
  }
}
