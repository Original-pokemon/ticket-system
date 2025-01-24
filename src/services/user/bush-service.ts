import { BushType } from "#root/types/index.js";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export class BushService extends BaseService<BushType> {
  constructor() {
    super(ApiRouteKey.Bush);
  }
}
