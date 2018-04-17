FROM node:9.11-alpine
WORKDIR /app
COPY package.json /app
# RUN npm install
COPY . /app
CMD npm run serve:universal
EXPOSE 8081