FROM cypress/included:13.6.1

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN mkdir -p reports/ui reports/api reports/webtables