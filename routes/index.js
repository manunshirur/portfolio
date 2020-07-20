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
    res.sendFile(path.join(__dirname, "../views/index.htm"));
});


router.get("/schedule", function (req, res){
    // res.sendFile(path.join(__dirname, "../views/schedule.html"));
    res.render("schedule");
});


router.get("/interests", function (req, res){
    // res.sendFile(path.join(__dirname, "../views/interests.html"));
    res.render("interests");
});


router.route("/contact")
   .get(function (req, res){
        res.render("contact");
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
                res.render("contact", {
                    errorMessage: "Sorry!! Error Sending Email",
                    successMessage: "",
                });
            } else {
                const file = JSON.parse(data);
                file.feedbacks.push(jsonObject);
                const json = JSON.stringify(file, null, 2);
         
                fs.writeFile('feedbacks.json', json, 'utf8', function(err){
                    if(err){ 
                        console.log("Written Unsuccesffully");
                        res.render("contact", {
                            errorMessage: "Sorry!! Error Storing your Feedback",
                            successMessage: "",
                        });
                    } else {
                        console.log("Written  Succesffully");
                        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                        var sentEmailFlag = sendEmail(email, name, fullUrl);
                        sentEmailFlag.then(function(response){
                            console.log("Email sent Successfully");
                            res.render("contact", {
                                successMessage: "A Confirmation Email has been sent to you. Thank you.",
                                errorMessage: ""});
                        }).catch((err) => {
                            console.log(err);
                            console.log("Email Not sent Successfully");
                            res.render("contact", {
                                errorMessage: "Sorry!! Error Sending Email",
                                successMessage: "",
                            });    
                        });
                }});
            }
    });
        
});



async function sendEmail(email, name, url) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
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

        let info = await transporter.sendMail(mailOptions);
        console.log(info);
}

module.exports = router;