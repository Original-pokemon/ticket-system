import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";

export type StatusHistoryType = {
  id: string;
  ticket_id: string;
  user_id: string;
  ticket_status: string;
  created_at: Date;
};

export class StatusHistoryService extends BaseService<StatusHistoryType> {
  constructor() {
    super(ApiRouteKey.StatusHistory);
  }
}
