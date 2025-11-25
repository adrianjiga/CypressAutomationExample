FROM cypress/included:15.7.0

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN mkdir -p reports/ui reports/api reports/webtables