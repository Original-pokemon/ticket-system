import { UserText } from "../const/index.js";

export const getCommentText = (userName: string, text: string) =>
  `<b>Комментарий</b>:\n${UserText.ViewComment.USER}: ${userName} \n${UserText.ViewComment.TEXT}: ${text}`;
