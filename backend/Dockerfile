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
ENV PORT=3001
EXPOSE 3001

ENTRYPOINT ["sh", "entrypoint.sh"]
