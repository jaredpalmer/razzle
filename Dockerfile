FROM mhart/alpine-node:7.6.0
WORKDIR /src
ADD . .
RUN npm install
EXPOSE 80
CMD ["npm", "run", "start:prod"]
