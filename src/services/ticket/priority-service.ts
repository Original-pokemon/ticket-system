import { PriorityType } from "#root/types/index.js";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class PriorityService extends BaseService<PriorityType> {
  constructor() {
    super(ApiRouteKey.Priority);
  }
}
