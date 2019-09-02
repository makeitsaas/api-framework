FROM node:11
WORKDIR /home/node/

COPY . .

RUN npm install --only=production

EXPOSE 3000

USER node
CMD [ "npm", "start" ]
