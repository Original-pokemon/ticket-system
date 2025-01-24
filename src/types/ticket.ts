export type TicketType = {
  id?: string;
  title: string;
  description: string;
  user_id?: string;
  attachments: string[];
  petrol_station_id: string;
  ticket_category?: string | null;
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
