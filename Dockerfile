# Используйте Node.js 14 LTS
FROM node:18.17.0-alpine AS builder

# Установите рабочую директорию в /app
WORKDIR /app

# Скопируйте файлы package.json и package-lock.json
COPY package.json ./

# Установите зависимости
RUN npm install

# Скопируйте остальные файлы приложения
COPY . .

# Соберите приложение Next.js
RUN npm run build

# Скопируйте собранные файлы, учитывая структуру
COPY .next ./.next

# Выставите порт, который http-server будет слушать
EXPOSE 8080

# Запустите http-server
CMD ["npm", "run", "dev"]
