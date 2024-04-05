FROM oven/bun:alpine as base

WORKDIR /app

FROM base as api
COPY bun.lockb package.json tsconfig.json /app/
RUN bun install
COPY src /app/

CMD ["bun", "run", "-b", "src/index.ts"]