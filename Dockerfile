FROM cypress/included:15.18.0

WORKDIR /app

COPY package*.json ./

RUN npm ci