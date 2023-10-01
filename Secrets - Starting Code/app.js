//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const port = 3000;
const app = express();

console.log(process.env.API_KEY);

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});



userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});
const User = mongoose.model('User', userSchema); 





app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.render("home.ejs");
});

app.get("/login",(req,res)=>{
    res.render("login.ejs");
});

app.get("/register",(req,res)=>{
    res.render("register.ejs");
});

app.post("/register",(req,res)=>{
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save();
    res.render("secrets.ejs");       

});

app.post("/login",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    if(null!=await User.findOne({email: username}).exec()){
      if(null!=await User.findOne({password: password}).exec()){
       res.render("secrets.ejs");
      }

    }
    
});

 


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  

