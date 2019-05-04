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
 - [Docker](https://medium.com/@uooworapon/docker-%E0%B8%89%E0%B8%9A%E0%B8%B1%E0%B8%9A%E0%B8%84%E0%B8%99%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B9%83%E0%B8%88%E0%B8%A2%E0%B8%B2%E0%B8%81-73dfc5e95677?fbclid=IwAR1gjxv79E4TkpyKsIPyVGqcTebYAtOzf_Sj6mmbJodSAoC2JqJkD0DVH80)


