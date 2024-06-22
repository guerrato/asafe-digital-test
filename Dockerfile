FROM node:20

WORKDIR /app

COPY package*.json .
COPY ./packages ./packages

RUN npm install
RUN npm -w packages/utils -w packages/api i
RUN npx -w packages/api prisma generate
RUN npm -w packages/utils run build
RUN npm -w packages/api run build

EXPOSE 3000

CMD ["npm", "start"]

