FROM node:20-alpine

WORKDIR /usr/app
COPY ./ /usr/app
RUN npm i --omit=dev --no-package-lock

USER node

CMD ["node","./index.js"]