FROM node:alpine
WORKDIR /src/quotes-app
COPY . .
RUN npm install
EXPOSE 5555
CMD [ "npm", "start"]