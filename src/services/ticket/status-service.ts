import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";

type StatusType = {
  id: number;
  description: string;
};

export class StatusService extends BaseService<StatusType> {
  constructor() {
    super(ApiRouteKey.Status);
  }
}
