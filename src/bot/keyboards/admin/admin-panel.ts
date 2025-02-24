import {
  AdminButton,
  SupervisorButtons,
  UserGroup,
} from "#root/bot/const/index.js";
import { chunk } from "#root/bot/helpers/index.js";
import { Keyboard, InlineKeyboard } from "grammy";

import {
  adminShowAllData,
  adminFindUserData,
  selectTicketsData,
  SelectTicketScene,
} from "#root/bot/callback-data/index.js";
import { groupStatusesMap } from "#root/bot/handlers/user/ticket/browse-tickets/group-statuses-map.js";

const buttons = Object.values(AdminButton);

export const createAdminKeyboard = async () => Keyboard.from(chunk(buttons, 2));

export function createAdminStartMenu() {
  return new InlineKeyboard()
    .text(AdminButton.ShowAll, adminShowAllData.pack({}))
    .row()
    .text(AdminButton.FindUser, adminFindUserData.pack({}))
    .row()
    .text(
      SupervisorButtons.AllTickets,
      selectTicketsData.pack({
        scene: SelectTicketScene.Status,
        availableStatuses:
          groupStatusesMap[UserGroup.Manager][AdminButton.AllTickets].join(","),
        pageIndex: 0,
        selectPetrolStationId: "",
        selectStatusId: "",
      }),
    );
}
