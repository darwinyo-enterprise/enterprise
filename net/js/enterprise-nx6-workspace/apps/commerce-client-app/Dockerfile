FROM node:10.4.0-alpine

RUN mkdir -p /usr/src
WORKDIR /usr/src
COPY ./js/enterprise-nx6-workspace .

RUN npm install

EXPOSE 4000

RUN npm run build:ssr:commerce-client
CMD ["npm", "run","serve:ssr:commerce-client"]

