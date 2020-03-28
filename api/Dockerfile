FROM node:12

COPY ./api/controllers /app/api/controllers
COPY ./api/models /app/api/models
COPY ./api/mongo /app/api/mongo
COPY ./api/package.json /app/api
COPY ./api/index.js /app/api

WORKDIR /app/api

RUN yarn install
RUN npm install -g nodemon

EXPOSE 3001

CMD ["npm", "start"]