FROM node

RUN mkdir /app
RUN cd /app
WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

RUN npm run ng build api --configuration production
RUN npm run ng build client

CMD [ "npm", "run", "prod" ]
