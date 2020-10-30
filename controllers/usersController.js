const { render } = require("ejs");
const express = require("express");
const router = express.Router();

const User = require("../models").User;
const Fruit = require('../models').Fruit;

//add delete route
router.delete('/:id',(req,res)=>{
    
    User.destroy({ where: { id: req.params.id } }).then(() => {
        res.redirect("/");
      }); 
})

// GET USERS PROFILE
router.get("/:id", (req, res) => {
    // IF USER ID FROM TOKEN MATCHES THE REQUESTED ENDPOINT, LET THEM IN
    if (req.user.id == req.params.id) {
      User.findByPk(req.params.id, {
        include: [
          {
            model: Fruit,
            attributes: ["id", "name"],
          },
        ],
      }).then((userProfile) => {
        res.render("users/profile.ejs", {
          user: userProfile,
        });
      });
    } else {
      // res.json("unauthorized");
      res.redirect("/");
    }
  });


router.put('/:id', (req, res) => { //:index is the index of our fruits array that we want to change

    User.update(req.body, {
        where: { id: req.params.id },
        returning: true,
    }).then((user) => {
        res.redirect(`/users/${req.params.id}`);
    });
  });



module.exports = router;