import {
  SelectTicketScene,
  selectTicketsData,
} from "#root/bot/callback-data/index.js";
import { TaskPerformerButtons, UserGroup } from "#root/bot/const/index.js";
import { groupStatusesMap } from "#root/bot/handlers/user/ticket/browse-tickets/group-statuses-map.js";
import { chunk } from "#root/bot/helpers/keyboard.js";
import { InlineKeyboard, Keyboard } from "grammy";

const buttons = Object.values(TaskPerformerButtons);

export const createTaskPerformerKeyboard = async () =>
  Keyboard.from(chunk(buttons, 2));

export const createTaskPerformerInlineKeyboard = async () => {
  const keyboard = InlineKeyboard.from([
    [
      {
        text: TaskPerformerButtons.ConsiderTickets,
        callback_data: selectTicketsData.pack({
          scene: SelectTicketScene.Status,
          availableStatuses:
            groupStatusesMap[UserGroup.TaskPerformer][
              TaskPerformerButtons.ConsiderTickets
            ].join(","),
          pageIndex: 0,
          selectPetrolStationId: "",
          selectStatusId: "",
        }),
      },
    ],
    [
      {
        text: TaskPerformerButtons.TicketsForPerformance,
        callback_data: selectTicketsData.pack({
          scene: SelectTicketScene.Status,
          availableStatuses:
            groupStatusesMap[UserGroup.TaskPerformer][
              TaskPerformerButtons.TicketsForPerformance
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
