FROM node:18-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN mkdir -p ${UPLOAD_DIR:-uploads}
EXPOSE 5000
CMD ["node", "server.js"]