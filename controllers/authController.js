require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require("../models").User;



router.get('/signup',(req,res)=>{
    res.render('users/signup.ejs');
});

router.get('/login',(req,res)=>{
    res.render('users/login.ejs');
});

router.post("/validateLogIn", (req, res) => {
    User.findOne({
      where: {
        username: req.body.username,
      },
    }).then((foundUser) => {
      if (foundUser) {
        bcrypt.compare(req.body.password, foundUser.password, (err, match) => {
          if (match) {
            const token = jwt.sign(
                {
                  username: foundUser.username,
                  id: foundUser.id,
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: "30 days",
                }
              );
            res.cookie("jwt", token); // SEND A NEW COOKIE TO THE BROWSER TO STORE TOKEN
            res.redirect(`/users/${foundUser.id}`);
          } else {
            res.redirect(`/auth/login`);
          }
        });
      }
    });
  });

//create user
router.post("/", (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(500).json(err);
  
      bcrypt.hash(req.body.password, salt, (err, hashedPwd) => {
        if (err) return res.status(500).json(err);
        req.body.password = hashedPwd;
  
        User.create(req.body)
          .then((newUser) => {
            const token = jwt.sign(
              {
                username: newUser.username,
                id: newUser.id,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "30 days",
              }
            );
            console.log(token);
        res.cookie("jwt", token); // SEND A NEW COOKIE TO THE BROWSER TO STORE TOKEN
            res.redirect(`/users/${newUser.id}`);
          })
          .catch((err) => {
            console.log(err);
            res.send(`err ${err}`);
          });
      });
    });
  });


module.exports = router;