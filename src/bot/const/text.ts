export const AdminText = {
  FindUser: {
    TEXT: "Введите ID пользователя",
    NOT_FOUND: "Пользователь не найден",
  },
  Admin: {
    USERS: "Выберите нужного пользователя",
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
  HELP: (manualLink?: string, siteLink?: string) => `
  ${manualLink ? `\nCсылка на инструкцию для вашей роли: ${manualLink}` : ""}
      ${siteLink ? `\nСсылка на инструкцию для сайта: ${siteLink}` : ""}`,
  Welcome: {
    UNAUTHORIZED:
      "Добро пожаловать в систему заявок!\n \nОжидайте, когда Вам выдадут роль, когда это произойдет Вы получите уведомление",
    getUserText: (role: string, commands: string[]) =>
      `Добро пожаловать! \nВаша роль: ${role}\n\n${commands.join("\n")} `,
    ADMIN: "Приветствую, Господин! ",
    BLOCKED: "Вы заблокированы",
  },
};

type NotificationTextProperties = {
  title: string;
  petrolStation: string;
};

export const UserText = {
  CreateTicket: {
    Interrupt: {
      BEEN_INTERRUPTED: "Создание заявки прервано",
      ABORT: "Прервать создание заявки",
      INPUT_NAME: "Пожалуйста введите имя пользователя или нажмите кнопку ниже",
      INPUT_TEXT: " Пожалуйста введите текст или нажмите кнопку ниже",
      SELECT_CATEGORY: "Пожалуйста Выберите категорию или нажмите кнопку ниже",
      SELECT_STATION: "Пожалуйста Выберите АЗС или нажимите кнопу ниже",
      SEND_PHOTO: "Пожалуйста отправьте фото или нажмите кнопку ниже",
    },
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
    CATEGORY: "Категорию",
    PRIORITY: "Приоритет",
  },
  TicketProfile: {
    TICKET_TITLE: "<b>Профиль задачи</b>",
    TITLE: "<i>Заголовок</i>",
    NUMBER: "<i>Объект</i>",
    MANAGER: "<i>Контакты менеджера</i>",
    CATEGORY: "<i>Категория</i>",
    DEADLINE: "<i>Дата исполнения</i>",
    STATUS: "<i>Статус</i>",
    DESCRIPTION: "<i>Описание</i>",
  },
  TicketProfilePanel: {
    ACCEPT_TEXT: "Принять задачу",
    SEND_TEXT: "Отправить",
    EDIT_TEXT: "Изменить",
    DELETE_TEXT: "Удалить",
    RETRIEVE_TEXT: "Вернуть задачу ",
    CONSIDER: "Отметить задачу выполненой",
  },
  Consider: {
    PETROL_STATIONS: "Выберите АЗС",
    TICKETS: "Выберите заявку",
  },
  AllTickets: {
    PETROL_STATIONS: "Выберите АЗС",
    TICKETS: "Выберите заявку",
  },
  DELETE_TICKET: "Заявка удалена",
  RETRIEVE_TICKET: (name: string, userName: string) =>
    `Заявка ${name} возвращена пользователем ${userName}`,
  GetPhotos: {
    MSG_TEXT:
      "Вы можете прикрепить фото\n\nДля этого отправьте фотографию\\фотографии",
    SAVE: "Сохранить ",
    NEXT: "Далее",
    PHOTO_CAPTION: "Прикрепленное фото",
    DELETE_PHOTO_BUTTON: "Удалить",
  },
  Notification: {
    ERROR_USER_GROUP:
      "Вы не можете отправить данную заявку т.к вы не соотвествуете группе пользователей",
    NEW_TICKET: ({ title, petrolStation }: NotificationTextProperties) =>
      `У вас новая заявка: ${title}.\nОбъект: ${petrolStation}`,
    PERFORMED: ({
      title,
      petrolStation,
      deadline,
    }: NotificationTextProperties & { deadline: string }) =>
      `Задача: "${title}" взята в работу. \nОбъект: ${petrolStation}\nСрок выполнения: ${deadline}`,
    STATUS_EDIT: (name: string, statusDec: string) =>
      `Статус задачи: "${name}" изменен на ${statusDec}.`,
    WAITING_CONFIRM: ({ title, petrolStation }: NotificationTextProperties) =>
      `Задача: "${title}" выполнена. \nОбъект: ${petrolStation}\nПожалуйста подтвердите выполнение задачи`,
    WITHOUT_CATEGORY: "Вы не можете отправить заявку без категории",
    SEEN_TICKET: ({ title, petrolStation }: NotificationTextProperties) =>
      `Заявка: "${title}" просмотрена. \nОбъект: ${petrolStation}`,
    COMPLIED: ({ title, petrolStation }: NotificationTextProperties) =>
      `Задача ${title} выполнена\nОбъект: ${petrolStation}`,
    WITHDRAW: ({ title, petrolStation }: NotificationTextProperties) =>
      `Заявка ${title} отозвана\nОбъект: ${petrolStation}`,
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
