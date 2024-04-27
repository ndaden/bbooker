### BBooker

## API

Install : `yarn` <br/>
Start : `yarn run backend`<br/>

## FRONT

npx tailwindcss -i ./src/input.css -o ./public/output.css --watch
Install : `yarn`<br/>
Start : `yarn run frontend`<br/>

## Environment variables to define

Create these env files :

./.env : for running on docker
./api/.env : for running on docker
dev.env : for running on host

and define these variables :

Api:
MONGODB_USERNAME : mongodb username<br/>
MONGODB_PASSWORD : mongodb password<br/>
MONGODB_URL : mongodb address<br/>
MONGODB_DBNAME: database name<br/>
JWT_SECRET : secret key for Json Web Token<br/>

Frontend :
PUBLIC_API_URL : Api to be called by frontend (eg: http://localhost:8080)<br/>

## Docker

`docker login`<br/>
`docker build --platform linux/arm64 -t <account>/bbooker-front:<tag> .`<br/>
`docker push <account>/bbooker-front:<tag>`<br/>
