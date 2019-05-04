# SIT-Personal-Accomplishment-API
(API)Senior Project of SIT at the King Mongkut's University of Technology Thonburi.

## Build Setup

``` bash
# install dependencies
npm install

# copy .env.example change to .env
# set environtment variable in .env file
# reference: https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786

#create folder config and add file 'service_account_key.json' to the folder

#create table
npm install knek -g
knex migrate:latest

#add mock-data to the table
knex seed:run

#run app
npm start

```

## Reference
 - [Knex.js](https://knexjs.org/#Installation-migrations)
 - [Multer API](https://github.com/expressjs/multer)
 - [Firebase Admin](https://firebase.google.com/docs/admin/setup)
 - [How to Upload file to Firebase Storage](https://github.com/tayalone/UploadFileFormNodeToFirebase)


