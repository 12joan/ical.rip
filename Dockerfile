FROM node:alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
HEALTHCHECK --start-period=1s --start-interval=1s \
  CMD curl -f http://localhost/ || exit 1
EXPOSE 80
