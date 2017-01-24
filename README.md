401 JS --  Lab 16 API AUTHORIZATION // LOGIN
===

## Documentation
In this project, I implement a rest API and utilize a database. There is also authorization enabled when sending a post request.

##Usage
`POST :4000/api/signup   username:      password:         email:` - should recieve a 200 status code if successful.

400 - when the request is missing a value.
409 - if the username is already taken.
