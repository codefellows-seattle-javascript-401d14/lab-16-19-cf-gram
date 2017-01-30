# Kenneth's  Lab 16 & 17 - API AUTHORIZATION // LOGIN

Lab instructions were to implement an API with Basic Authentication with hash encryption and use the Bearer Authentication as the cipher.

## Description

This is a REST API that users can query a server with information about a soda collection.


## How To Use

Via a terminal window, users will be able to POST, GET, and DELETE in the following manner:

  1. The user must first login with username and password and email at the ```/api/signup``` endpoint.
  2. Once the user has logged in, the user will receive a authorization token.

+ The sodacollection has three properties:
  +`brand` (required)
  +`diet` (required)
  +`taste`

### POST

To post to the database, type the following:
  + `http POST localhost:3000/api/sodacollection brand=" " diet=" " taste=" "`

### GET

To retrieve a collection from the database, type the following:
  + `http GET localhost:3000/api/sodacollection brand=" " diet=" " taste=" "`

### DELETE
  + `http DELETE localhost:3000/api/sodacollection brand=" " diet=" " taste=" "`
