FROM node:24.18.0-alpine3.24 AS build
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && yarn install --immutable

COPY src/ src/
COPY prisma/ prisma/
COPY nest-cli.json tsconfig.json tsconfig.build.json ./

RUN yarn prisma generate
RUN yarn build


FROM node:24.18.0-alpine3.24 AS prod
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && yarn workspaces focus --production

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma/ prisma/
COPY entrypoint.sh ./

RUN chmod +x entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3001

# Configuration lives outside the image, so an upgrade is just a new image:
#   docker run -v ./config.json:/app/config.json ...
# Override the location with -e CONFIG_PATH=/etc/queue-master.json or `--config <path>`.
# Precedence: CLI argument > config file > environment variable > default.

ENTRYPOINT ["sh", "entrypoint.sh"]
