FROM node:latest

RUN yarn global add nodemon

WORKDIR /app

COPY package.json /app
RUN yarn install

COPY . /app

EXPOSE 4000
CMD [ "yarn", "dev" ]
