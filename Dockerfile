FROM node:alpine
WORKDIR /usr/src/quotes-app
COPY . .
RUN npm install
EXPOSE 5555
CMD [ "npm", "start"]