import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

type GroupType = {
  id: string;
  description: string;
  users?: string[];
};

export class GroupService extends BaseService<GroupType> {
  constructor() {
    super(ApiRouteKey.Group);
  }
}
