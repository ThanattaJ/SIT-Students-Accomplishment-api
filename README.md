# SIT-Personal-Accomplishment-api
(API)Senior Project of SIT at King Mongkut's University of Technology Thonburi.

## Build Setup

``` bash
# install dependencies
npm install

# copy .env.example change to .env
# set environtment variable in .env file
# reference: https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786

#create table
npm install knek -g
knex migrate:latest

#run app
npm start


