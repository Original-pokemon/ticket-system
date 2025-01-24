import { ManagerType } from "#root/types/index.js";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class ManagerService extends BaseService<ManagerType> {
  constructor() {
    super(ApiRouteKey.Manager);
  }
}
