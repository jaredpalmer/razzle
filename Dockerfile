FROM mhart/alpine-node:4.3.1
WORKDIR /src
ADD . .
RUN npm install
EXPOSE 80
CMD ["npm", "run", "start:prod"]
