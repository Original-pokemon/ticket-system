import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

type PriorityType = {
  id: number;
  description: string;
};

export class PriorityService extends BaseService<PriorityType> {
  constructor() {
    super(ApiRouteKey.Priority);
  }
}
