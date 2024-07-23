import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";
import { TicketStatus } from "../../bot/const/index.js";

export type TicketType = {
  id?: string;
  title: string;
  description: string;
  user_id?: string;
  attachments: string[];
  petrol_station_id: string;
  ticket_category?: string;
  deadline?: string;
  status_id: string;
  created_at?: Date;
  status_history?: {
    id?: string;
    ticket_id?: string;
    user_id: string;
    ticket_status: string;
    created_at?: Date;
  }[];
  comments: string[];
};

export class TicketService extends BaseService<TicketType> {
  constructor() {
    super(ApiRouteKey.Ticket);
  }

  updateTicketStatus = async ({
    userId,
    ticketId,
    statusId,
  }: {
    userId: string;
    ticketId: string;
    statusId: TicketStatus;
  }) => {
    const ticket = await this.getUnique(ticketId);

    const updatedTicket = await this.update({
      ...ticket,
      status_id: statusId,
      status_history: [
        {
          user_id: userId,
          ticket_status: statusId,
        },
      ],
    });

    return updatedTicket;
  };
}
