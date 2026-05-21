FROM node:lts-bookworm-slim AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts && \
    pnpm rebuild @parcel/watcher @swc/core esbuild vue-demi

FROM deps AS build
WORKDIR /app
COPY . .
RUN node ace build --ignore-ts-errors

FROM base AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/build ./
COPY --from=build /app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts && \
    pnpm rebuild @parcel/watcher vue-demi

COPY docker-entrypoint.js ./

EXPOSE 3333
CMD ["node", "docker-entrypoint.js"]
