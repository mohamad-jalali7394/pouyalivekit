FROM docker.shooka.com/node:14 as build
WORKDIR /build
COPY . .
USER root
RUN npm config set registry https://mirror.shooka.com/repository/npm/
RUN rm -rf package-*.json
RUN rm -rf node_modules
RUN npm install --legacy-peer-deps
RUN npm run build

FROM docker.shooka.com/node:current-alpine3.17 as final
WORKDIR /app
RUN npm install -g serve@
COPY --from=build  /build/dist ./dist/
RUN ls
CMD ["serve", "-s", "dist", "-p", "8080"]