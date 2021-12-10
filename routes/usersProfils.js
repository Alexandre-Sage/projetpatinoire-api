var express = require('express');
var router = express.Router();
var slugify = require("slugify");


router.get("/", function(req, res, next){
console.log("FullusersProfilsJson");
    const dataBase= req.app.locals.db;
    dataBase.query("SELECT * FROM usersProfils",[], function(err, userProfil){
        if(err) throw err;
        res.json(userProfil);

    })
})
module.exports = router;

router.get("/countriesInscriptionForm", function(req,res,next){
    console.log("PaysInscriptionForm");
    const dataBase= req.app.locals.db;
    dataBase.query("SELECT * FROM countries",[], function(err, countries){
        if(err) throw err;
        res.json(countries);
    })
})
module.exports = router;

router.get("/townsInscriptionForm/:urlRequest", function(req,res,next){
    const dataBase= req.app.locals.db;
    const urlRequest= req.params.urlRequest;
    const sqlRequest="SELECT * FROM towns WHERE countryId=?"
    dataBase.query(sqlRequest,urlRequest ,function(err, towns){
        if(err) throw err;
        res.json(towns);
    })
})
module.exports = router;

router.post("/sendInscriptionForm", function(req, res, next){
    const dataBase= req.app.locals.db;
    let postedData= req.body;
    dataBase.query("INSERT INTO usersProfils(countryId, townId, firstName, lastName, birthday, email, userName, password, profilCreationDate) VALUES(?,?,?,?,?,?,NOW())",
    [postedData.country, postedData.town, postedData.firstName, postedData.lastName, postedData.birthday,postedData.email, postedData.userName, postedData.password])

    console.log(postedData["password"]);

});
module.exports = router;
