### Questions

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

MONGODB_USERNAME : mongodb username<br/>
MONGODB_PASSWORD : mongodb password<br/>
MONGODB_URL : mongodb address<br/>
