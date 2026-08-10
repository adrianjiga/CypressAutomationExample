FROM cypress/included:15.20.0

WORKDIR /app

COPY package*.json ./

RUN npm ci