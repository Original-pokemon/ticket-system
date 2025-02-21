import { StatusHistoryType } from "#root/types/index.js";
import { AxiosInstance } from "axios";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class StatusHistoryService extends BaseService<StatusHistoryType> {
  constructor(api: AxiosInstance) {
    super(ApiRouteKey.StatusHistory, api);
  }
}
