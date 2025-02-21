import { GroupType } from "#root/types/index.js";
import { AxiosInstance } from "axios";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class GroupService extends BaseService<GroupType> {
  constructor(api: AxiosInstance) {
    super(ApiRouteKey.Group, api);
  }
}
