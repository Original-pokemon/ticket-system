import { PriorityType } from "#root/types/index.js";
import { AxiosInstance } from "axios";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class PriorityService extends BaseService<PriorityType> {
  constructor(api: AxiosInstance) {
    super(ApiRouteKey.Priority, api);
  }
}
