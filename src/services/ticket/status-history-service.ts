import { BaseService } from "../base-service.ts";
import { ApiRouteKey } from "../const.ts";

type StatusHistoryType = {
  ticket_id: string;
  user_id: string;
  ticket_status: number;
  updated_at: Date;
};

export class StatusHistoryService extends BaseService<StatusHistoryType> {
  constructor() {
    super(ApiRouteKey.StatusHistory);
  }
}
