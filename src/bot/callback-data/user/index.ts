import { createCallbackData } from "callback-data";

export * from "./ticket-callback-data.js";
export * from "./manager-callback-data.js";
export * from "./task-performer-callback-data.js";
export * from "./show-petrol-stations.js";
export * from "./photo-callback-data.js";
export * from "./select-property-ticket.js";

export const startMessageCallback = createCallbackData("start-callback", {});
