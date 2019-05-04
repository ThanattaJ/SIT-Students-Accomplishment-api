FROM node:8.15.0
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 7000
CMD ["npm", "start"]