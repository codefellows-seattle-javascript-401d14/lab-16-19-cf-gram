401 JS --  Lab 16 API AUTHORIZATION // LOGIN
===

## Submission Instructions
  * Work in a fork of this repository
  * Work in a branch on your fork
  * Write all of your code in a directory named `lab-` + `<your name>` **e.g.** `lab-duncan`
  * Submit a pull request to this repository
  * Submit a link to your pull request on canvas
  * Submit a question, observation, and how long you spent on canvas  
  
## Learning Objectives  
<!-- the leaning objectives from the corisponding class number --> 
## Resources  
<!-- a list of liks if any are necessary for the assignment--> 
## Requirements  
#### Configuration  
<!-- list of files, configurations, tools, ect that are required -->
Your lab directory must include  
* **README.md** -- with a documention about your lab
* **.gitignore** -- with a robust gitignore
 * ** ADD '.env' and 'db' to  your .gitignore**
* **.eslintrc** -- with the class .eslintrc file
* **.eslintignore** -- with the class .eslintignore
* **.package.json** -- with all dependencies and dev-dependencies 
* **db/** - directory for your mongo db files
* **lib/** - a directory for helper modules
* **model/** - a directory for constructor functions
* **test/** - a directory for test modules
* **server.js** - entry point to your program
 
#### Feature Tasks  
* Create a new HTTP Server using `express`
* Use the `http-errors` npm  module with the new `error-response` middleware from lecture
* Create a **User Model** using mongoose with the properties `username`, `password`, 'email', and `findHash`
 * The user must have a unique username and findhash
 * the user must have an email 
 * The user must never store the password as plain text (hash the password)
 * The user must have a method for genorating a token from the findHash
* use the `body-parser` express middleware to on `POST` and `PUT` routes
* use the npm `debug` module to log the functions being executed in your app
* using the express `Router` create an auth router with routes for **signup**
* Your server should depend on the environment variables
 * `DEBUG` - for turing on logging
 * `APP_SECRET` - for signing and verify tokens
 * `PORT` - for setting the port your server will listen on
 * `MONGODB_URI` - for setting the URI that mongoose will conect to

###### POST `/api/signup`
* `POST` request
 * the client should pass the username and passord in the body of the request
 * the server should respond with a token genoratorated using jsonwebtoken and the users findHash
 * the server should respond with a 400 Bad Request to failed request

#### Testing  
* your tests should start your server when they begin and stop your server when they finish
* write a test to ensure that your api returns a status code of 404 for routes that have not been registered
* `/api/signup`
 * `POST` - test 400, responds with the `http-errors` 401 name, for if no `body provided` or `invalid body`
 * `POST` - test 409, when a username is allready taken
 * `POST` - test 200, response body like `<token>` for a post request with a valid body

####  Documentation  
* write api docs in your README

<!-- a description of what you want the student to test -->
## Rubric  
* 2ps Configuration
* 3pts Feature Tasks
* 3pts Tests
* 2pts Documentation




