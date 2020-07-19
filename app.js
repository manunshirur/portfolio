/*********************************************************
 * Express Application 
 * Manu Shirur
 *********************************************************/
"use strict";

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path")

// Options while serving static files
let options = {
    dotfiles: "ignore", // Request to access hidden files are ignored
    extensions: ["htm", "html"], // When a file is requwsted without extensions, these are added
    index: false, // it disables the directory indexing
    redirect: false // if file is not founf then we are not redirecting to the root directory
};

// Serving Static files 
app.use(express.static(path.join(__dirname, "static"), options));


app.use(express.urlencoded({
    extended: true
  }));


// Separating Routes for simplicity
let router = require(path.join(__dirname, "routes"));

app.use("/", router);


app.listen(port, (err) => {
    if (err) {
        console.log("Error While starting the server", err);
        return;
    } 
    console.log(`Listening to Port:${port}`);
});



