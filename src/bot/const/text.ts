export const AdminText = {
  FindUser: {
    TEXT: "Введите ID пользователя",
    NOT_FOUND: "Пользователь не найден",
  },
  Admin: {
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
  Block: {
    USER_BLOCK: "Пользователь успешно заблокирован",
    USER_MESSAGE: "Вы заблокированы",
  },
  Unblock: {
    USER_UNBLOCK: "Пользователь успешно разблокирован",
    USER_MESSAGE: "Теперь вы разблокированы",
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

export const UserText = {
  CreateTicket: {
    PETROL_STATIONS: "Выберите АЗС",
    CATEGORY: "Выберите нужную картигорию",
    PRIORITY: "Выберите приоритет. \nЧем БОЛЬШЕ ЦИФРА тем МЕНЬШЕ ПРИОРИТЕТ",
    SAVE_TICKET: "Задача Сохранена",
    TICKET_TITLE: "Введите заголовок задачи",
    TICKET_DESCRIPTION: "Введите описание задачи",
  },
  EditTicket: {
    Title: "Введите новый заголовок",
    Description: "Введите новое описание",
    EditPanelTitle: "Выберите то, что Вы хотите изменить",
  },
  EditTicketPanel: {
    TITLE: "Заголовок",
    DESCRIPTION: "Описание",
    CATEGORY: "Катигорию",
    PRIORITY: "Приоритет",
  },
  TicketProfile: {
    TICKET_TITLE: "<b>Профиль задачи:</b>",
    TITLE: "- Заголовок",
    NUMBER: "- Номер АЗС",
    CATEGORY: "- Категория",
    PRIORITY: "- Приоритет",
    STATUS: "- Статус",
    DESCRIPTION: "<b>Описание</b>",
  },
  TicketProfilePanel: {
    ACCEPT_TEXT: "Принять задачу",
    SEND_TEXT: "Отправить",
    EDIT_TEXT: "Изменить",
    DELETE_TEXT: "Удалить",
    RETRIEVE_TEXT: "Вернуть задачу ",
    CONSIDER: "Задача выполнена",
  },
  Consider: {
    PETROL_STATIONS: "Выберите АЗС",
    TICKETS: "Выберите билет",
  },
  AllTickets: {
    PETROL_STATIONS: "Выберите АЗС",
    TICKETS: "Выберите билет",
  },
  DELETE_TICKET: "Билет удален",
  RETRIEVE_TICKET: (name: string) => `Билет ${name} возвращен`,
  GetPhotos: {
    MSG_TEXT:
      "Вы можете прикрепить фото\n\nДля этого отправьте фотографию\\фотографии",
    UNHANDLED_TEXT: "Plese send a photo or press the button",
    SAVE: "Сохранить ",
    NEXT: "Далее",
    PHOTO_CAPTION: "Прикрепленное фото",
    DELETE_PHOTO_BUTTON: "Удалить",
  },
  SendTicket: {
    NEW_TICKET: (name: string) => `У вас новая заявка: ${name}`,
    PERFORMED: (name: string) => `Задача ${name} взята в работу`,
    STATUS_EDIT: "Статус задачи изменен",
    COMPILED_TICKET: (name: string) => `Задача ${name} выполнена`,
    WITHOUT_CATEGORY:
      "Вы не можете отправить заявку без категории и приоритета",
  },
  ViewComment: {
    USER: "<i>Пользователь</i>",
    TEXT: "<i>Текст комментария</i>",
  },
  TakeTicket: {
    COMMENT: "Введите Ваш комментарий",
    BUTTON: "Отметить задачу выполненной",
  },
};
