var express = require('express');
var router = express.Router();
var slugify = require("slugify");
var crypto = require("crypto");

router.get("/:emailInput/:passwordInput", async function(req, res, next){
    const dataBase= req.app.locals.db;
    const userEmail= req.params.emailInput;
    const userPassword= req.params.passwordInput;
    let passwordConfirmation= false;
    const passwordSqlRequest="SELECT password FROM usersProfils WHERE email=?";
    const userProfilSqlRequest= "SELECT * FROM usersProfils WHERE email=?";
    const emailSqlRequest="SELECT email FROM usersProfils";

    function hidePassword(password){
        const sha256= crypto.createHash("sha256");
        const hide= sha256.update(password).digest('base64');
        return hide;
    }
    dataBase.query(emailSqlRequest , function(err, emails){
        const emailConfirmation=emails.find(email=>email.email===userEmail);
        console.log(emailConfirmation)
        if(emailConfirmation){
            console.log(emailConfirmation);
            dataBase.query( passwordSqlRequest,userEmail, function(err, password){
                {password[0].password===hidePassword(userPassword)? passwordConfirmation=true:passwordConfirmation=false};
                if (passwordConfirmation){
                    dataBase.query(userProfilSqlRequest,userEmail, function(err, userProfil){
                        console.log(userProfil);
                        res.json(userProfil);
                    })
                } else {
                    res.json("mdp")}
            });
        } else {
            res.json("mail")
        }
    });

})
module.exports = router;

router.post("/importPhoto", function(req,res,next){
    const dataBase= req.app.locals.db;
    picture= req.body;
    sqlRequest=`INSERT INTO usersProfils(profilPicture)
                WHERE userId=1
                VALUES(?)`;
    dataBase.query(sqlRequest, function(err, picture{

    })
}
