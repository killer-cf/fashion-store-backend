FROM node:16.16-slim AS builder

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /home/node/app

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN pnpm i --frozen-lockfile
RUN pnpm dlx prisma generate

COPY . .

RUN pnpm run build

FROM node:16.16-slim AS production

RUN apt-get update -y && apt-get install -y openssl

RUN npm install -g pnpm

WORKDIR /app

COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/package*.json ./
COPY --from=builder /home/node/app/pnpm-lock.yaml ./
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/prisma ./prisma

RUN pnpm i --frozen-lockfile --prod

USER node

EXPOSE 3333

CMD [ "pnpm", "run", "start:prod" ]