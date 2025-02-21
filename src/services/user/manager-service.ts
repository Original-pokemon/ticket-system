import { ManagerType } from "#root/types/index.js";
import { AxiosInstance } from "axios";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class ManagerService extends BaseService<ManagerType> {
  constructor(api: AxiosInstance) {
    super(ApiRouteKey.Manager, api);
  }
}
