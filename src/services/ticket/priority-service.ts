import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

type PriorityType = {
  id: string;
  description: string;
};

export class PriorityService extends BaseService<PriorityType> {
  constructor() {
    super(ApiRouteKey.Priority);
  }
}
