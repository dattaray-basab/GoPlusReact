# my-app is the client side sub directory of root

FROM node:16

WORKDIR /app

# Install jq
RUN apt-get update && apt-get install -y jq

COPY package.json yarn.lock* ./
RUN yarn install

# Copy the entire app
COPY . .

# Copy the set_env.sh script
COPY set_env.sh .

# Make the script executable
RUN chmod +x set_env.sh

# We'll run set_env.sh and then build when the container starts
CMD ["/bin/sh", "-c", "./set_env.sh && yarn build && yarn start"]