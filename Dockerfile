FROM cypress/included:15.18.1

WORKDIR /app

COPY package*.json ./

RUN npm ci