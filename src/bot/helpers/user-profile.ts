import { UserType } from "#root/services/index.js";
import { AdminText } from "../const/text.js";

export const getProfileText = (user: UserType) => {
  const {
    UserProfile: { USER_NAME, NAME, LAST_NAME, USER_GROUP, CREATED_DATE },
  } = AdminText;
  return `ID: ${user.id}
${USER_NAME}: ${user.user_name}
${NAME}: ${user.first_name}
${LAST_NAME}: ${user.last_name || "Отсутствует"}
${USER_GROUP}: ${user.user_group}
${CREATED_DATE}: ${user.created_at}`;
};
