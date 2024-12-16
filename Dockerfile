FROM node:20.14.0

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
