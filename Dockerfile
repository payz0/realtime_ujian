FROM node:16-alpine3.14

WORKDIR /app

ADD . /app

RUN npm install
RUN npm install pm2 -g

# CMD ["npm", "start"]
CMD ["pm2-runtime","main.js"]