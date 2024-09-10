# FROM node:16

# WORKDIR /app

# COPY package.json yarn.lock ./

# RUN yarn install

# COPY . .

# RUN yarn build

# EXPOSE 3000

# CMD ["yarn", "start"]

FROM node:16

WORKDIR /app

# Copy the export script and siteConfig.json
COPY export_config.sh siteConfig.json ./

# Install jq
RUN apt-get update && apt-get install -y jq

# Run the export script to set environment variables
RUN chmod +x export_config.sh && . ./export_config.sh

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE ${CONTAINER_APP_PORT}

CMD ["yarn", "start"]