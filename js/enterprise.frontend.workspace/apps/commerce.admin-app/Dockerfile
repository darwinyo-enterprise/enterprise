FROM node:8.11.2-alpine
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD npm run serve:universal
EXPOSE 8081