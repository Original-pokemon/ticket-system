import { selectTicketPropertyData } from "#root/bot/callback-data/index.js";
import { UserText } from "#root/bot/const/index.js";
import { chunk } from "#root/bot/helpers/index.js";
import { InlineKeyboard } from "grammy";

export const EditPanelButtonKey = {
  TITLE: "title",
  DESCRIPTION: "description",
  CATEGORY: "category",
} as const;

export type EditPanelButtons =
  (typeof EditPanelButtonKey)[keyof typeof EditPanelButtonKey];

const EditPanelButtonText = {
  [EditPanelButtonKey.TITLE]: UserText.EditTicketPanel.TITLE,
  [EditPanelButtonKey.DESCRIPTION]: UserText.EditTicketPanel.DESCRIPTION,
  [EditPanelButtonKey.CATEGORY]: UserText.EditTicketPanel.CATEGORY,
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
};

const EditPanelButtons = Object.values(EditPanelButton);

export const createEditPanelKeyboard = () =>
  InlineKeyboard.from(chunk(Object.values(EditPanelButtons), 1));
