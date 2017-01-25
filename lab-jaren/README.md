Lab-16 & 17 API Basic and Bearer Authorization
===
Implement API with basic auth using hashing algorithms and bearer auth using ciphers.

## Description
A REST API for users on an HTTP server that users can make a POST request to with appropriate routes and responses.
#### Modules
- **server.js** -- starts the server and creates an instance of a router for the users API
- **user.js** -- item constructor that takes the password field of the request and uses a hashing algorithm to encrypt the password for storage in the database. Also generates a token using a cipher algorithm and an APP_SECRET environment variable for the user to make CRUD requests to the server. POST requests take input data for:
  - username
  - email
  - password
- **gallery.js** -- constructor for a model that associates with one unique user and will eventually hold many photos. POST requests require input for:
  - title
- **auth-router.js** -- creates routes for letting users signup by filling in user data, logging in if they already exist as a user
- **gallery-router.js** -- creates routes for doing CRUD operations on galleries, for which users only have authorization with the token they get by succesfully logging in
- **basic-auth-middleware.js** -- implements the user login feature
- **bearer-auth-middleware.js** -- implements the token authentication for POST, GET, and DELETE routes

## Usage
Before adding user information, you will need three separate terminal windows for this simulation.

##### First window
- Create a file in the directory for your environment variables by typing `atom .env`, or whichever text-editor you use in place of atom, and on the first line type `MONGODB_URI=mongodb://localhost/dev`.
- On the next line type `APP_SECRET=secret` then save the file.
- You must initiate MongoDB for your session. In one of the terminal windows, type `mongod --dbpath ./db` to indicate the database folder.

##### Second window
- In the second terminal window, type `node server.js` and the server will be up on port 4000 unless you specify otherwise in the `.env` file.
  - If you wish to use a different port, open your `.env` file and on the next line type `PORT=8000` or whichever port you choose. Then use that port in place of `4000` in the below steps.
- As you make requests to the server, the `morgan.js` module logs each request in this window.

##### Third window
- To add a new user to the API, type in a POST request, filling the empty quotes with your data:
  - `http POST :4000/api/signup username="" email="" password=""`
  - The server will respond with a `200 OK` status and return the new user data.
  - If you get `400 Bad Request` that means you didn't fill out all the properties.
  - If you get `409 Conflict` you picked a username that already exists.
  - If you get `404 Not Found` you used a bad endpoint.
- To login as an existing user, type in a GET request with your username and password as follows:
  - `http -a username:password GET :4000/api/login`
  - Any failed attempts will result in a `401 Unauthorized`.
  - Upon success, the server will respond with a very long scrambled token. You use this token to make authorized requests to the server while logged in.
- Here would go the section of making POST, GET, DELETE requests with the `/api/gallery` endpoint, but I couldn't figure out how to use jwt tokens in HTTPie. The docs only have an option for installing using Python.
