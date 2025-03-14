FROM node:23-alpine

WORKDIR /usr/src/app
COPY package*.json tsconfig.json ./
COPY proto/*.proto proto/
RUN npm install
COPY apps/api-gateway .
RUN npm run build

CMD ["node", "dist/src/main.js"]
