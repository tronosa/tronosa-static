FROM node:24.15.0-bookworm-slim AS web

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm install --global pnpm@12.6.0

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build:test

EXPOSE 3000

CMD ["pnpm", "start:test"]


FROM grafana/k6:2.4.0 AS reliability

WORKDIR /app

COPY --from=web /app/tests/reliability ./tests/reliability
COPY --from=web /app/.next/prerender-manifest.json ./.next/prerender-manifest.json