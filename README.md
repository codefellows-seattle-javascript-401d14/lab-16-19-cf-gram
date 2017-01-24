## Description
Lab16-19 Node REST API using HTTP module and file system storage
Implement a rest API and use persistent data
We use this lab to learn authorization/authentication in order to construct our router for users

## Usage
/api/signup
POST - test 400, when the request has a missing field in the body
POST - test 401, when no token is provided
POST - test 409, when a username is already taken
POST - test 200, response body that has the token for a post request with a valid body


  ## Modules
  - *server.js  starts the server and creates an instance of a router for auth
  - *user.js -- item constructor that assigns a unique id to each user and takes user input data for:

    - username  required for POST*
    - password  required for POST*
    -email required for POST*
  - *auth-router.js -- routes manages request states

  ## Testing
  To run the tests use npm install once all is installed type mocha into your terminal command line.
