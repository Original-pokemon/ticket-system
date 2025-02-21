import { UserType } from "#root/types/index.js";
import { AxiosInstance } from "axios";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class UserService extends BaseService<UserType> {
  constructor(api: AxiosInstance) {
    super(ApiRouteKey.User, api);
  }
}
