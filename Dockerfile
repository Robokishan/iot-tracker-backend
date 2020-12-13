# docker build -t xoxo-backend .
# docker run -d -p 5000:5000 -v $PWD:/usr/src/app --name xoxo-backend -ti xoxo-backend /bin/bash
# docker run -p 80:80 -e "PGADMIN_DEFAULT_EMAIL=postgres" -e "PGADMIN_DEFAULT_PASSWORD=postgres" -d dpage/pgadmin4
FROM node:12
WORKDIR /usr/src/app
COPY package.json .
RUN npm install -g nodemon
RUN npm install
RUN npm install nodemon
COPY . .
EXPOSE 5000 3000
CMD ["npm", "start"]