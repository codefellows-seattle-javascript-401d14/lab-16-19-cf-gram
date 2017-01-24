401 JS --  Lab 16 API Auth // Basic and Bearer
===

## Submission Instructions
  * Work in a fork of this repository
  * Work in a branch on your fork
  * Write all of your code in a directory named `lab-` + `<your name>` **e.g.** `lab-duncan`
  * Submit a pull request to this repository
  * Submit a link to your pull request on canvas
  * Submit a question, observation, and how long you spent on canvas  
  
## Learning Objectives  
* Students will be able to implement basic and bearer auth for their APIs

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
* **test/lib** - a directory for test helper modules
* **server.js** - entry point to your program
 
#### Feature Tasks  
* Create a Basic auth middleware for implementing login
* Create a Bearer auth middleware for implementing authentication on routes
* Create a model that that represents a collecion of some file type, like the gallery model from class (pics, mp3s, movs)
 * later in the week you will make a model that represents that file type and we will be uploading those files
 to aws
* create the following routes
* refactor your mocks into their own modules
###### GET `/api/login`
* the client should pass the username and passord in the basic auth header of the request
* the server should respond with a token generated using jsonwebtoken and the users findHash
* the server should respond with a 401 Bad Request to failed request

#### Testing  
* your tests should start your server when they begin and stop your server when they finish
* write a test to ensure that your API returns a status code of 404 for routes that have not been registered
* `/api/login`
 * `GET` - test 401, when no authorization header is provided
 * `GET` - test 200, response body that has the token for a post request with a valid body

* `/api/<your collection>`
 * `POST` - 200, 400, 401
 
* `/api/<your collection>/:id`
 * `GET` - 200, 404, 401
 * `DELETE` - 200, 404, 401

####  Documentation  
* write API docs in your README

<!-- a description of what you want the student to test -->
## Rubric  
* 2ps Configuration
* 3pts Feature Tasks
* 3pts Tests
* 2pts Documentation
