FROM node:12

COPY ./api /app/api

WORKDIR /app/api

RUN yarn install
RUN npm install -g nodemon

EXPOSE 3001

CMD ["npm", "start"]