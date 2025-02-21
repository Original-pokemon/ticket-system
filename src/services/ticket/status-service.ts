import { StatusType } from "#root/types/index.js";
import { AxiosInstance } from "axios";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class StatusService extends BaseService<StatusType> {
  constructor(api: AxiosInstance) {
    super(ApiRouteKey.Status, api);
  }
}
