FROM node:lts-slim AS base

# Установка рабочей директории
WORKDIR /app

FROM base AS builder

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копирование исходного кода
COPY . .

RUN npm run build

FROM base AS runner

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/build ./build

# Запуск приложения
CMD ["node", "./build/scripts/start.js"]

