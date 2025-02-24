import {
  SelectTicketScene,
  selectTicketsData,
} from "#root/bot/callback-data/index.js";
import { ManagerButtons, UserGroup } from "#root/bot/const/index.js";
import { groupStatusesMap } from "#root/bot/handlers/user/ticket/browse-tickets/group-statuses-map.js";
import { chunk } from "#root/bot/helpers/index.js";
import { InlineKeyboard, Keyboard } from "grammy";

const buttons = Object.values(ManagerButtons);

export const createManagerKeyboard = async () =>
  Keyboard.from(chunk(buttons, 2));

export const createManagerInlineKeyboard = async () => {
  const keyboard = InlineKeyboard.from([
    [
      {
        text: ManagerButtons.CreateTicket,
        callback_data: ManagerButtons.CreateTicket,
      },
    ],
    [
      {
        text: ManagerButtons.AllTickets,
        callback_data: selectTicketsData.pack({
          scene: SelectTicketScene.Status,
          availableStatuses:
            groupStatusesMap[UserGroup.Manager][ManagerButtons.AllTickets].join(
              ",",
            ),
          pageIndex: 0,
          selectPetrolStationId: "",
          selectStatusId: "",
        }),
      },
    ],
    [
      {
        text: ManagerButtons.ConsiderTickets,
        callback_data: selectTicketsData.pack({
          scene: SelectTicketScene.Status,
          availableStatuses:
            groupStatusesMap[UserGroup.Manager][
              ManagerButtons.ConsiderTickets
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
