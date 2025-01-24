import { GroupType } from "#root/types/index.js";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class GroupService extends BaseService<GroupType> {
  constructor() {
    super(ApiRouteKey.Group);
  }
}
