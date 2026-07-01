FROM node:24.18.0-alpine3.24 AS deps
WORKDIR /app

COPY frontend/package.json frontend/yarn.lock frontend/.yarnrc.yml ./frontend/
COPY frontend/apps/web/package.json ./frontend/apps/web/
COPY frontend/apps/kiosk/package.json ./frontend/apps/kiosk/
COPY frontend/packages/shared-components/package.json ./frontend/packages/shared-components/
COPY frontend/packages/shared-utils/package.json ./frontend/packages/shared-utils/

RUN corepack enable && cd frontend && yarn install --immutable


FROM node:24.18.0-alpine3.24 AS build
WORKDIR /app

COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY frontend/ ./frontend/

RUN corepack enable && cd frontend && yarn build:web


FROM node:24.18.0-alpine3.24 AS runner
WORKDIR /app

COPY --from=build /app/frontend/apps/web/.next/standalone ./
COPY --from=build /app/frontend/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/frontend/apps/web/public ./apps/web/public

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
