var express = require('express');
var router = express.Router();


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
    const sqlRequest="SELECT townName FROM towns WHERE countryId=?"
    dataBase.query(sqlRequest,urlRequest ,function(err, towns){
        if(err) throw err;
        res.json(towns);
    })
})
module.exports = router;

/*router.post("/inscription", function(req, res, next){
    const dataBase= req.app.locals.db;
});
module.exports = router;*/
