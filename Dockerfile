FROM node:alpine

RUN mkdir /app
RUN cd /app
WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

COPY . .

RUN npm run ng build api --configuration production
RUN npm run ng build client

CMD [ "npm", "run", "prod" ]
