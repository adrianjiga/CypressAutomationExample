FROM cypress/included:14.4.1

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN mkdir -p reports/ui reports/api reports/webtables