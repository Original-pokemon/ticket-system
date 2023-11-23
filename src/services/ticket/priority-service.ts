import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";

type PriorityType = {
  id: number;
  description: string;
};

export class PriorityService extends BaseService<PriorityType> {
  constructor() {
    super(ApiRouteKey.Priority);
  }
}
