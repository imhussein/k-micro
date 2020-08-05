FROM node:alpine
LABEL maintainer="Mciro"
RUN mkdir app
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]