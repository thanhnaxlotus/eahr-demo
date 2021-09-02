FROM node:14-alpine3.11

WORKDIR /app

RUN apk add curl
ENV NODE_ENV=develop
COPY ./package.json .
COPY ./yarn.lock .
# RUN yarn
RUN npm i nuxt -g
# RUN npm install --global yarn
COPY . .
RUN echo $NODE_ENV
# ONBUILD RUN npm yarn
# RUN ls -a node_modules/@nuxtjs/style-resources
ENV HOST 0.0.0.0
EXPOSE 3001
# CMD ["yarn", "dev"]
CMD ["sh", "-c", "yarn && yarn dev"]
