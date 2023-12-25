import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";
import type { UserType } from "../index.ts";

type TicketType = {
  petrol_station: string;
  ticket: string[];
};

export type ManagerType = {
  user_id: string;
  bush_id?: number;
  ticket?: TicketType[];
  petrol_stations?: string[];
  user?: UserType;
};

export class ManagerService extends BaseService<ManagerType> {
  constructor() {
    super(ApiRouteKey.Manager);
  }
}
