# docker build -t iot-backend -f Dockerfile .
# development
# docker run -d -p 5000:5000 -v $PWD:/usr/src/app --name iot-backend -ti xoxo-backend /bin/bash
# testing
# docker run --rm -p 5000:5000 --name iot-backend -ti iot-backend
# docker run -p 80:80 -e "PGADMIN_DEFAULT_EMAIL=postgres" -e "PGADMIN_DEFAULT_PASSWORD=postgres" -d dpage/pgadmin4
FROM node:12
WORKDIR /usr/src/app
COPY package.json .
COPY .env .env
RUN npm install -g nodemon
RUN npm install --silent
RUN npm install nodemon
COPY . .
EXPOSE 5000 3000
CMD ["npm", "start"]
