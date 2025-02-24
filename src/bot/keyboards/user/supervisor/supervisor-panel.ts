import {
  SelectTicketScene,
  selectTicketsData,
} from "#root/bot/callback-data/index.js";
import { SupervisorButtons, UserGroup } from "#root/bot/const/index.js";
import { groupStatusesMap } from "#root/bot/handlers/user/ticket/browse-tickets/group-statuses-map.js";
import { chunk } from "#root/bot/helpers/keyboard.js";
import { InlineKeyboard, Keyboard } from "grammy";

const buttons = Object.values(SupervisorButtons);

export const createSupervisorKeyboard = async () =>
  Keyboard.from(chunk(buttons, 2));

export const createSupervisorInlineKeyboard = async () => {
  const keyboard = InlineKeyboard.from([
    [{ text: SupervisorButtons.CreateTicket, callback_data: "" }],
    [
      {
        text: SupervisorButtons.AllTickets,
        callback_data: selectTicketsData.pack({
          scene: SelectTicketScene.Status,
          availableStatuses:
            groupStatusesMap[UserGroup.Manager][
              SupervisorButtons.AllTickets
            ].join(","),
          pageIndex: 0,
          selectPetrolStationId: "",
          selectStatusId: "",
        }),
      },
    ],
  ]);

  return keyboard;
};
