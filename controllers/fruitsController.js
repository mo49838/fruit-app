const express = require('express');
const router = express.Router();

// Add fruit model
// const fruits = require("../fruits.js");
const Fruit = require("../models").Fruit;
const User = require('../models').User;
const Season = require("../models").Season;

// Add index route
router.get("/", (req, res) => {
  Fruit.findAll().then((fruits) => {
    res.render("index.ejs", {
      fruits: fruits,
    });
  });
});


// router.post('/',(req,res)=>{
//     console.log(req.body);
//     if(req.body.readyToEat == "on")
//         req.body.readyToEat = true;
//     else    
//         req.body.readyToEat = false;

//     fruits.push(req.body);
//     res.redirect('/fruits');
// });

//put this above your show.ejs file
router.get("/new", (req, res) => {
    res.render("new.ejs");
  });

  router.post("/", (req, res) => {
    if (req.body.readyToEat === "on") {
      req.body.readyToEat = true;
    } else {
      req.body.readyToEat = false;
    }
  
    Fruit.create(req.body).then((newFruit) => {
      res.redirect("/fruits");
    });
  });


  router.get("/:id", (req, res) => {
    Fruit.findByPk(req.params.id, {
      include : [{
          model: User,
          attributes: ['name']
      },
      {
        model: Season,
      }
    ],
      attributes: ['name', 'color', 'readyToEat']
  }).then((fruit) => {
      res.render("show.ejs", {
        fruit: fruit,
      });
    });
  });

 
  router.get("/:id/edit", function (req, res) {
    Fruit.findByPk(req.params.id).then((foundFruit) => {
      Season.findAll().then((allSeasons) => {
        res.render("edit.ejs", {
          fruit: foundFruit,
          seasons: allSeasons,
        });
      });
    });
  });

  router.put("/:id", (req, res) => {
    if (req.body.readyToEat === "on") {
      req.body.readyToEat = true;
    } else {
      req.body.readyToEat = false;
    }
    Fruit.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    }).then((updatedFruit) => {
      Season.findByPk(req.body.season).then((foundSeason) => {
        Fruit.findByPk(req.params.id).then((foundFruit) => {
          foundFruit.addSeason(foundSeason);
          res.redirect("/fruits");
        });
      });
    });
  });

// app.get('/fruits', (req, res) => {
//     res.render('index.ejs',{fruits:fruits});
// });

router.delete("/:id", (req, res) => {
  Fruit.destroy({ where: { id: req.params.id } }).then(() => {
    res.redirect("/fruits");
  });
});

module.exports = router;