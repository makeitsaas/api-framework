FROM node:11
USER node
WORKDIR /home/node/

COPY . .

RUN npm install --only=production

EXPOSE 3000

CMD [ "npm", "start" ]
