declare module "telegram-inline-calendar" {
  import { Api, Context } from "grammy";

  interface CalendarOptions {
    date_format: string;
    start_date?: Date;
    stop_date?: Date;
    language: string;
    bot_api: string;
    initialDate?: Date;
    custom_start_msg?: string;
  }

  class Calendar {
    constructor(bot: Api, options: CalendarOptions);

    clickButtonCalendar(context: Context): string | number;

    startNavCalendar(context: Context): void;
  }

  export { Calendar };
}
