import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";

type BushType = {
  id: number;
  description: string;
};

export class BushService extends BaseService<BushType> {
  constructor() {
    super(ApiRouteKey.Bush);
  }
}
