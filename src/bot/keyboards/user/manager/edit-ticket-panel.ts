import { selectTicketPropertyData } from "#root/bot/callback-data/index.ts";
import { UserText } from "#root/bot/const/index.ts";
import { chunk } from "#root/bot/helpers/index.ts";
import { InlineKeyboard } from "grammy";

export const EditPanelButtonKey = {
  TITLE: "title",
  DESCRIPTION: "description",
  CATEGORY: "category",
  PRIORITY: "priority",
} as const;

export type EditPanelButtons =
  (typeof EditPanelButtonKey)[keyof typeof EditPanelButtonKey];

const EditPanelButtonText = {
  [EditPanelButtonKey.TITLE]: UserText.EditTicketPanel.TITLE,
  [EditPanelButtonKey.DESCRIPTION]: UserText.EditTicketPanel.DESCRIPTION,
  [EditPanelButtonKey.CATEGORY]: UserText.EditTicketPanel.CATEGORY,
  [EditPanelButtonKey.PRIORITY]: UserText.EditTicketPanel.PRIORITY,
} as const;

const EditPanelButtonCallback = {
  [EditPanelButtonKey.TITLE]: selectTicketPropertyData.pack({
    id: EditPanelButtonKey.TITLE,
  }),
  [EditPanelButtonKey.DESCRIPTION]: selectTicketPropertyData.pack({
    id: EditPanelButtonKey.DESCRIPTION,
  }),
  [EditPanelButtonKey.CATEGORY]: selectTicketPropertyData.pack({
    id: EditPanelButtonKey.CATEGORY,
  }),
  [EditPanelButtonKey.PRIORITY]: selectTicketPropertyData.pack({
    id: EditPanelButtonKey.PRIORITY,
  }),
} as const;

const generateEditPanelButton = (key: EditPanelButtons) => ({
  text: EditPanelButtonText[key],
  callback_data: EditPanelButtonCallback[key],
});

const EditPanelButton: Record<
  EditPanelButtons,
  ReturnType<typeof generateEditPanelButton>
> = {
  [EditPanelButtonKey.TITLE]: generateEditPanelButton(EditPanelButtonKey.TITLE),
  [EditPanelButtonKey.DESCRIPTION]: generateEditPanelButton(
    EditPanelButtonKey.DESCRIPTION,
  ),
  [EditPanelButtonKey.CATEGORY]: generateEditPanelButton(
    EditPanelButtonKey.CATEGORY,
  ),
  [EditPanelButtonKey.PRIORITY]: generateEditPanelButton(
    EditPanelButtonKey.PRIORITY,
  ),
};

const EditPanelButtons = Object.values(EditPanelButton);

export const createEditPanelKeyboard = () =>
  InlineKeyboard.from(chunk(Object.values(EditPanelButtons), 1));
