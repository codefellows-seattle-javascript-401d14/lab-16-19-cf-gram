401 JS --  Lab 16/17/18/19 API AUTHORIZATION // LOGIN
===

## description

This is a rest API enabling users to post images to a database which uses cipher and hash authorization.

## modules

Gallery.js, photo.js, user.js in the model folder for building users photos and gallery files. auth-router.js, gallery-router.js, and photo-router.js modules for routing each model appropriately after it's been build. Server.js module for starting server and managing routes. Basic-auth-middleware.js for managing password hashes for user authentication. bearer-auth-middleware for managing tokens for authentication.

## usage

Three separate terminal windows must be opened prior to usage. Type "mongod --dbpath ./db" in first terminal window to indicate path of your database. Second terminal window type out  "node server.js" to start your server. Third terminal window offers different commands for users on the server; post, get, and delete. Server response of 200 means successful response. 400 is a bad request. 404 means the item is not found. 401 is unauthorized access. 409 means there is a conflict with your post.
