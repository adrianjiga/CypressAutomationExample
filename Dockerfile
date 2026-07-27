FROM cypress/included:15.19.0

WORKDIR /app

COPY package*.json ./

RUN npm ci