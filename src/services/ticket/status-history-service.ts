import { StatusHistoryType } from "#root/types/index.js";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class StatusHistoryService extends BaseService<StatusHistoryType> {
  constructor() {
    super(ApiRouteKey.StatusHistory);
  }
}
