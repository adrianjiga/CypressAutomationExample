FROM cypress/included:15.14.2

WORKDIR /app

COPY package*.json ./

RUN npm ci