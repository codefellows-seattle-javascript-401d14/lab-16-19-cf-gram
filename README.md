401 JS --  Lab 16 API AUTHORIZATION // LOGIN
===

## Documentation
In this project, I implement a rest API and utilize a database. There is also authorization enabled when sending a post request.

##Usage

### User module
`POST :4000/api/signup   username:      password:         email:` - should recieve a 200 status code if successful.

400 - when the request is missing a value.
409 - if the username is already taken.

`GET :4000/api/login        `-
should recieve a 200 status code if successful.
401 - when not authorized.


### Album module
`POST :4000/api/login   title:    ` - should recieve a 200 status code if successful.

400 - when the request is missing a value.
401 - when not authorized.

`GET :4000/api/login /:id       `- should recieve a 200 status code if successful.

401 - when not authorized.
404 - when item can not be found.

`DELETE :4000/api/login /:id       `- should recieve a 204 status code if successful.

401 - when not authorized.
404 - when item can not be found.
