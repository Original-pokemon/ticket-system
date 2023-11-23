import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";

type GroupType = {
  id: string;
  description: string;
};

export class GroupService extends BaseService<GroupType> {
  constructor() {
    super(ApiRouteKey.Group);
  }
}
