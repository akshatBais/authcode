var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var users = require("./models/users.js");
var passport = require("passport");
var passportLocal = require("passport-local");
var passportlocalmongoose = require("passport-local-mongoose");

var app = express();

mongoose.connect('mongodb://localhost/auth');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(require('express-session')({
    secret: "Poonam Rocks",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());
passport.use(new passportLocal(users.authenticate()));
app.use(express.static(__dirname + '/public'));

app.get("/",function(req,res){
    res.redirect('/login');
});

app.get("/secret",isLoggedIn,function(req,res){
    res.render('secret');
});

app.get("/login",function(req,res){
    res.render('index');
});

app.post('/login',passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}),function(req,res){
    
});

// app.post("/auth/secret",function(req,res){
//     res.render('secret');
// });

app.get("/register",function(req,res){
    res.render('register');
});

app.get("/logout",function(req,res){
    req.logout();
    req.redirect('/login');
})

app.post("/register",function(req,res){
    users.register(new users({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
        }
        passport.authenticate('local')(req,res,function(){
            res.redirect("/secret");
        });
    })
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
}
app.listen(process.env.PORT, process.env.IP,function(){
    console.log('server started');
});
