import { BushType } from "#root/types/index.js";
import { AxiosInstance } from "axios";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class BushService extends BaseService<BushType> {
  constructor(api: AxiosInstance) {
    super(ApiRouteKey.Bush, api);
  }
}
