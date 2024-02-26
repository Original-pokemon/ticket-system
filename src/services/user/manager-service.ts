import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";
import type { UserType } from "../index.js";

type TicketType = {
  petrol_station: string;
  tickets: string[];
};

export type ManagerType = {
  user_id: string;
  bush_id?: string;
  tickets?: TicketType[];
  petrol_stations?: string[];
  user?: UserType;
};

export class ManagerService extends BaseService<ManagerType> {
  constructor() {
    super(ApiRouteKey.Manager);
  }
}
