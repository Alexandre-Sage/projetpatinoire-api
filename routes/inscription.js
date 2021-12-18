var express = require('express');
var router = express.Router();
var slugify = require("slugify");
var crypto = require("crypto");
var app = express();

router.get("/countriesInscriptionForm", function(req,res,next){
    const dataBase= req.app.locals.db;
    dataBase.query("SELECT * FROM countries",[], function(err, countries){
        return res.json(countries);
    });
});
module.exports = router;

router.get("/townsInscriptionForm/:urlRequest", function(req,res,next){
    //if(err) throw err;
    const dataBase= req.app.locals.db;
    const urlRequest= req.params.urlRequest;
    const sqlRequest="SELECT * FROM towns WHERE countryId=?"
    dataBase.query(sqlRequest,urlRequest ,function(err, towns){
        res.json(towns);
        if (err) throw err;
    })
})
module.exports = router;

router.post("/sendInscriptionForm", async function (req, res, next){
    const dataBase= req.app.locals.db;
    let postedData= req.body;
    let sucess=false;
    function hidePassword(password){
        const sha256= crypto.createHash("sha256");
        const hide= sha256.update(password).digest('base64');
        return hide;
    }
    do{
        try{
            await dataBase.promise().query("INSERT INTO usersProfils(countryId, townId, firstName, lastName, birthday, email, userName, password, profilCreationDate) VALUES(?,?,?,?,?,?,?,?,NOW())",
            [postedData.country, postedData.town, postedData.firstName, postedData.lastName, postedData.birthday,postedData.email, postedData.userName, hidePassword(postedData.password)]);
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
        console.log("ok");
    }
});
module.exports = router;

/*  code: 'ER_DUP_ENTRY',
  errno: 1062,
  sqlState: '23000',
  sqlMessage: "Duplicate entry 'hello2' for key 'userName'",
  sql: "INSERT INTO usersProfils(countryId, townId, firstName, lastName, birthday, email, userName, password, profilCreationDate) VALUES('2','2','test','test','2021-12-06','test4','hello2','test',NOW())"
*/

/*  code: 'ER_DUP_ENTRY',
  errno: 1062,
  sqlState: '23000',
  sqlMessage: "Duplicate entry 'test4' for key 'email'",
  sql: "INSERT INTO usersProfils(countryId, townId, firstName, lastName, birthday, email, userName, password, profilCreationDate) VALUES('2','2','test','test','2021-12-06','test4','hello2f','test',NOW())"
}
*/
