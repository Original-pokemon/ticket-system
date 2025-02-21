import { TicketType } from "#root/types/index.js";
import { AxiosInstance } from "axios";
import { BaseService } from "../base-service.js";
import { ApiRouteKey } from "../const.js";
import { TicketStatus } from "../../bot/const/index.js";

export class TicketService extends BaseService<TicketType> {
  constructor(api: AxiosInstance) {
    super(ApiRouteKey.Ticket, api);
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
