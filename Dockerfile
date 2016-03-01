FROM mhart/alpine-node:5
WORKDIR /src
ADD . .
RUN npm install
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "start:prod"]
