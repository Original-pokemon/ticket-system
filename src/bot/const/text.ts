export const AdminText = {
  FindUser: {
    TEXT: "Введите ID пользователя",
    NOT_FOUND: "Пользователь не найден",
  },
  AdminCommand: {
    USERS: "Выберете нужного пользователя",
    BUSHES: "Выберите куст пользователя",
    EDIT_USER_NAME:
      "Измените имя.\nОно должно соотвествовать инициалам (Петровкин Петр Петрович) или номеру АЗС (АЗС №0000)",
    getUserRegText: (userLogin: string, role: string) =>
      `Пользователь ${userLogin} зарегистирован Роль: ${role}`,
    SAVE_RELATIONSHIP: "Связи обновленны",
  },
  UserProfile: {
    USER_NAME: "Имя пользователя",
    NAME: "Имя",
    LAST_NAME: "Фамилия",
    USER_GROUP: "Группа пользователя",
    CREATED_DATE: "Дата создания",
  },
  Keyboard: {
    SAVE: "Сохранить",
  },
};

export const BotText = {
  UNHANDLER: "Нераспознанная команда. Попробуйте /start",
  Welcome: {
    UNAUTHORIZED:
      "Добро пожаловать в систему заявок!\n \nОжидайте, когда Вам выдадут роль, когда это произойдет Вы получите уведомление",
    getUserText: (role: string) => `Добро пожаловать! \nВаша роль: ${role}`,
    ADMIN: "Приветствую, Господин! ",
    BLOCKED: "Вы заблокированы",
  },
};
