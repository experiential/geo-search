FROM node:alpine as dev
WORKDIR '/app'
COPY ./package.json ./
RUN yarn install
COPY . .
CMD ["yarn", "start"]

FROM dev as builder
RUN yarn build

FROM nginx as prod
COPY --from=builder /app/build /usr/share/nginx/html
