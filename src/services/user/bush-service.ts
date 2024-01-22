import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

type BushType = {
  id: number;
  description: string;
};

export class BushService extends BaseService<BushType> {
  constructor() {
    super(ApiRouteKey.Bush);
  }
}
