FROM node:14-alpine3.11

WORKDIR /app

RUN apk add curl
ENV NODE_ENV=develop
COPY ./package.json .
COPY ./yarn.lock .
RUN npm i nuxt -g
RUN yarn
# RUN npm install --global yarn
COPY . .
RUN echo $NODE_ENV
RUN yarn build
# ONBUILD RUN npm yarn
# RUN ls -a node_modules/@nuxtjs/style-resources
ENV HOST 0.0.0.0
EXPOSE 3000
CMD ["yarn", "start"]
# CMD ["sh", "-c", "yarn && yarn dev"]