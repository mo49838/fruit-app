require('dotenv').config();
const express = require('express');
const app = express();
const methodOverride = require('method-override');

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const verifyToken = (req, res, next) => {
    let token = req.cookies.jwt; // COOKIE PARSER GIVES YOU A .cookies PROP, WE NAMED OUR TOKEN jwt
  
    console.log("Cookies: ", req.cookies.jwt);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
      if (err || !decodedUser) {
        return res.status(401).json({ error: "Unauthorized Request" });
      }
      req.user = decodedUser; // ADDS A .user PROP TO REQ FOR TOKEN USER
      console.log(decodedUser);
  
      next();
    });
  };

app.use(cookieParser());

app.use(methodOverride('_method'));
app.use(express.static("public"));
// const fruits = require('./models/fruits.js'); //NOTE: it must start with ./ if it's just a file, not an NPM package

//near the top, around other app.use() calls
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
     res.render('users/index.ejs');
});

//middle ware
app.use((req, res, next) => {
    console.log('I run for all routes');
    next();
});

app.use("/fruits", verifyToken, require("./controllers/fruitsController.js"));

app.use("/users", verifyToken, require("./controllers/usersController.js")); 

app.use("/auth", require("./controllers/authController.js"));

app.listen(process.env.PORT, () => {
    console.log('listening');
});

