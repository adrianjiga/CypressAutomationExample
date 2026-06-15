FROM cypress/included:15.17.0

WORKDIR /app

COPY package*.json ./

RUN npm ci