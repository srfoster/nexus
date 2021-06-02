FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN apk update
RUN apk add postgresql-client 
RUN apk add bash 

RUN npm install -g nodemon

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8000
CMD [ "npm", "run", "dev" ]
