FROM node:18

WORKDIR /app

COPY package.json ./

# Force clean install inside Docker using Linux-native binaries
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]