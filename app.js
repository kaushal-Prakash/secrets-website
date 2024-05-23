require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); 
const md5 = require("md5");

mongoose.connect("mongodb://127.0.0.1/userDB");

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

const User = new mongoose.model("User",userSchema);


app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/secrets",(req,res)=>{
    res.render("secrets");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save()
        .then(() => {
            // User saved successfully
            res.render("secrets");
        })
        .catch((err) => {
            // Handle the error
            console.error(err);
            // You can also send an error response to the client if needed
            res.status(500).send("Internal server error");
        });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const pass = md5(req.body.password);

    User.findOne({ email: username })
        .then((founduser) => {
            if (founduser) {
                // Compare hashed passwords (use bcrypt or similar)
                // For demonstration purposes, I'm assuming plain text comparison
                if (founduser.password === pass) {
                    res.render("secrets");
                } else {
                    res.status(401).send("Incorrect password");
                }
            } else {
                res.status(404).send("User not found");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Server error");
        });
});



app.listen("3000",(req,res)=>{
    console.log("server started at port 3000");
});