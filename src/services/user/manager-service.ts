import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";
import type { UserType } from "../index.ts";

export type ManagerType = {
  user_id: string;
  bush_id?: number;
  petrol_stations?: string[];
  user?: UserType;
};

export class ManagerService extends BaseService<ManagerType> {
  constructor() {
    super(ApiRouteKey.Manager);
  }
}
