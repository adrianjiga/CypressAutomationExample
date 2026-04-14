FROM cypress/included:15.13.1

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN mkdir -p reports/ui reports/api reports/webtables