import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

type StatusType = {
  id: number;
  description: string;
};

export class StatusService extends BaseService<StatusType> {
  constructor() {
    super(ApiRouteKey.Status);
  }
}
