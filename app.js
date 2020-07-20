/*********************************************************
 * Express Application 
 * Manu Shirur
 *********************************************************/
"use strict";

const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const port = process.env.PORT || 3000;


app.set("view engine", "hbs");
app.engine("hbs", exphbs({
    extname: 'hbs',
    defaultLayout: 'main', 
    layoutsDir: path.join(__dirname,"views/layouts")
}));



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



