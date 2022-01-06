var express = require('express');
var router = express.Router();
var slugify = require("slugify");
var app = express();
var sqlRequests= require("./sqlRequests/inscriptionSqlRequests");

var userSession= require("./modules/session/userSession");

//Route permettant de récuperer les pays fetcher par inscriptionForm.jsx
router.get("/countriesInscriptionForm", function(req,res,next){
    const dataBase= req.app.locals.db;
    dataBase.query(sqlRequests.sqlRequestCountriesInscriptionFormRoute,[], function(err, countries){
        return res.json(countries);
    });
});
module.exports = router;

//Route permettant de réuperer les villes en fonctions du pays choisis dans la route précédente fetcher par inscriionForm.jsx
router.get("/townsInscriptionForm/:urlRequest", function(req,res,next){
    const dataBase= req.app.locals.db;
    const urlRequest= req.params.urlRequest;
    dataBase.query(sqlRequests.sqlRequestTownsInscriptionFormRoute,urlRequest ,function(err, towns){
        res.json(towns);
        if (err) throw err;
    })
})
module.exports = router;

//Route d'envoie du formulaire d'inscriptions poster par inscriptionForm.jsx
router.post("/sendInscriptionForm", async function (req, res, next){
    const dataBase= req.app.locals.db;
    let postedData= req.body;
    let sucess=false;
    //const sqlRequestDefaultProfilPicture= 'INSERT INTO profilPicture(userId, imageId) VALUES(?,1)';

    do{
        try{
            await dataBase.promise().query(sqlRequests.sqlRequestSendInscritpionFormRoute, [postedData.country, postedData.town, postedData.firstName, postedData.lastName, postedData.birthday,postedData.email, postedData.userName, userSession.hidePassword(postedData.password)]);
            sucess=true;
        }catch(err){
            if(err.code==="ER_DUP_ENTRY"){
                const sqlMessageUserName=`Duplicate entry '${postedData.userName}' for key 'userName'`;
                const sqlMessageEmail=`Duplicate entry '${postedData.email}' for key 'email'`;
                if (sqlMessageUserName===err.sqlMessage){
                    res.json("Pseudo déja utiliser")
                } else if(sqlMessageEmail===err.sqlMessage){
                    res.json("Email déja utiliser")
                };
            }
        }
    } while(!sucess){
        res.json("Profil créer avec succes");
    }
});
module.exports = router;
