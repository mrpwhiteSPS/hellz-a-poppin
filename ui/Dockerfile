FROM node:12

COPY ./ui/public /app/ui/public
COPY ./ui/src /app/ui/src
COPY ./ui/package.json /app/ui

WORKDIR /app/ui

RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent

EXPOSE 3000

CMD ["npm", "start"]