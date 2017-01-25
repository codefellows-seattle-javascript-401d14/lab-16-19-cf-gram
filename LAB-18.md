401 JS --  Lab 18 API Auth // Basic and Bearer
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
* **assets/** - directory for storing asset files
* **lib/** - a directory for helper modules
* **model/** - a directory for constructor functions
* **test/** - a directory for test modules
* **test/lib** - a directory for test helper modules
* **test/mock-assets/**
* **server.js** - entry point to your program
 
#### Feature Tasks  
* finish writing your routes from labs 16 and 17
* create a new model that represents a file type (picture, movie, song)
* create a POST that uses the multer middleware to parse the `mulitpart/form-data` request
 * it shuold store any uploaded files into the **assets/** directory
 
###### POST `/api/<your file resource>`
* the route should use bearer auth 
* the route should use the multer middleware to parse any uploaded fields and file attachments
 * multer should be configured to store uploaded files into the **asset/** directory 
 * respond to the user with some dummy data like "hello world" until tomorrow!

#### Testing  
* finish writing your tests from labs 16 and 17
* write a tests that uploads a file tyou your new route 
 * your new test dont have to pass untill tomorrow when we will upload the file to s3 and respond to the user 

####  Documentation  
* write API docs in your README

<!-- a description of what you want the student to test -->
## Rubric  
* 2ps Configuration
* 3pts Feature Tasks
* 3pts Tests
* 2pts Documentation
