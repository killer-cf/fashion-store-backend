FROM node:16.16-slim AS builder

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /home/node/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install -g pnpm

RUN pnpm install
RUN pnpm dlx prisma generate

COPY . .

RUN pnpm run build

FROM node:16.16-slim AS production

RUN apt-get update -y && apt-get install -y openssl

COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/package*.json ./
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/prisma ./prisma

USER node

EXPOSE 3333

CMD [ "npm", "run", "start:migrate:prod" ]