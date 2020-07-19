/*********************************************************
 * All Routes of the Application 
 * Manu Shirur
 *********************************************************/
"use strict";
const express = require("express");
const path = require("path");
const { body, validationResult } = require('express-validator');
const nodemailer = require("nodemailer");
const fs = require("fs");
let router = express.Router(); 


router.get("/", function (req, res){
    console.log("In root");
    res.sendFile(path.join(__dirname, "../views/index.htm"))
});


router.get("/schedule", function (req, res){
    console.log("IN here");
    res.sendFile(path.join(__dirname, "../views/schedule.html"))
});


router.get("/interests", function (req, res){
    res.sendFile(path.join(__dirname, "../views/interests.html"))
});


router.route("/contact")
   .get(function (req, res){
        console.log("Here in Get");
        res.sendFile(path.join(__dirname, "../views/contact.html"))
    })
    .post([
        // Server-side Validation using express-validator
        body('name').not().isEmpty(),
        body('address').not().isEmpty(),
        body('phone').not().isEmpty(),
        body('email').isEmail(),
        body('experience').not().isEmpty(),
        body('comments').not().isEmpty()
      ], function (req, res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        var name = req.body.name;
        var address = req.body.address;
        var phone = req.body.phone;
        var email = req.body.email;
        var experience = req.body.experience;
        var comments = req.body.comments;
        var jsonObject = {
            "name": name,
            "address": address,
            "phone": phone,
            "email": email,
            "experience": experience,
            "comments":comments
        };

        fs.readFile('feedbacks.json', 'utf8', function readFileCallback(err, data){
            if (err) {
                console.log(err)
            } else {
                const file = JSON.parse(data);
                file.feedbacks.push(jsonObject);
                const json = JSON.stringify(file, null, 2);
         
                fs.writeFile('feedbacks.json', json, 'utf8', function(err){
                    if(err){ 
                        console.log(err);
                        return res.status(422).json({ errors: "Error Storing your feedback" });
                    } else {
                        console.log("Written  Succesffully")
                }});
            }
         });

        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        // if (!sendEmail(email, name, fullUrl)) {
        //     return res.status(422).json({ errors: "Error Sending Email" });
        // }
        res.sendFile(path.join(__dirname, "../views/contact.html"));
    });



function sendEmail(email, name, url) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
        // user: process.env.CS350491EMAILUSER,
        // pass: process.env.CS350491EMAILPASS
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Confirmation Email',
        text: 'Dear ' + name + ', \n Thank you for your feedback! \n\n – From \nManuShirur@'+url
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error);
            return false;
        }
        console.log("Email Sent:", info.response);
        return true;
    });
}

module.exports = router;