# The instructions for the first stage
FROM node:14-alpine as builder

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

#RUN steps for build only such as installing python, libs, etc
#RUN apk --no-cache add python make g++

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# The instructions for second stage
FROM node:14-alpine

WORKDIR /usr/src/app
COPY --from=builder node_modules node_modules

COPY . .

CMD [ "yarn", "start" ]