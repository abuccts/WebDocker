FROM node:dubnium-alpine

WORKDIR /usr/src/app
ENV NODE_ENV=production \
    SERVER_PORT=8080

COPY . .
RUN yarn install

EXPOSE ${SERVER_PORT}
CMD ["yarn", "start"]
