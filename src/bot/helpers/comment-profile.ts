import { UserText } from "../const/index.ts";

export const getCommentText = (userName: string, text: string) =>
  `<b>Комментарий</b>:\n${UserText.ViewComment.USER}: ${userName} \n${UserText.ViewComment.TEXT}: ${text}`;
