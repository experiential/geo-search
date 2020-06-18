FROM node:alpine as base
WORKDIR '/app'
COPY ./package.json ./
RUN yarn install
COPY . .

FROM base as dev
RUN yarn build
COPY . .
CMD ["yarn", "dev"]

FROM base as prod
RUN yarn build-prod
COPY . .
CMD ["yarn", "start"]
