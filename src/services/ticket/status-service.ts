import { StatusType } from "#root/types/index.js";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class StatusService extends BaseService<StatusType> {
  constructor() {
    super(ApiRouteKey.Status);
  }
}
