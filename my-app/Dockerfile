# my-app is the root directory of the project

FROM node:16

WORKDIR /app



COPY package.json yarn.lock* ./
RUN yarn install

COPY . .

ENV PORT=${CONTAINER_APP_PORT}
EXPOSE ${PORT}

CMD ["/bin/sh", "-c", "source ./set_env.sh && yarn start"]