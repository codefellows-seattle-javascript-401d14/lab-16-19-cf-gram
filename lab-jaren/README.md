Lab-16 API Authorization // Signup
===
Implement API with basic auth using hashing algorithms

## Description
A REST API for users on an HTTP server that users can make a POST request to with appropriate routes and responses.
#### Modules
- **server.js** -- starts the server and creates an instance of a router for the users API
- **user.js** -- item constructor that takes the password field of the request and uses a hashing algorithm to encrypt the password for storage in the database. Also generates a token for the user to make requests to the server. POST requests take input data for:
  - username
  - email
  - password
- **auth-router.js** -- creates routes for doing CRUD operation on users

## Usage
Before adding user information, you will need three separate terminal windows for this simulation.

##### First window
- Create a file in the directory for your environment variables by typing `atom .env`, or whichever text-editor you use in place of atom, and on the first line type `MONGODB_URI=mongodb://localhost/dev`.
- On the next line type `APP_SECRET=secret` then save the file.
- You must initiate MongoDB for your session. In one of the terminal windows, type `mongod --dbpath ./db` to indicate the database folder.

##### Second window
- In the second terminal window, type `node server.js` and the server will be up on port 3000 unless you specify otherwise in the `.env` file.
  - If you wish to use a different port, open your `.env` file and on the next line type `PORT=2000` or whichever port you choose. Then use that port in place of `3000` in the below steps.
- As you make requests to the server, the `morgan.js` module logs each request in this window.

##### Third window
- To add a new user to the API, type in a POST request, filling the empty quotes with your data:
  - `http POST :3000/api/signup username="" email="" password=""`
  - The server will respond with a `200 OK` status and return the new user data.
  - If you get `400 Bad Request` that means you didn't fill out all the properties.
  - If you get `409 Conflict` you picked a username that already exists.
  - If you get `404 Not Found` you used a bad endpoint.
