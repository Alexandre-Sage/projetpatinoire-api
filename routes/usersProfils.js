var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var slugify = require("slugify");
var crypto = require("crypto");
var app = express();
var usersKeys= require("./modules/usersKeys.js");

function hidePassword(password){
    const sha256= crypto.createHash("sha256");
    const hide= sha256.update(password).digest('base64');
    return hide;
};

function generateAuthToken(){
    return crypto.randomBytes(30).toString('hex');
};

router.post("/:emailInput/:passwordInput", function(req, res, next){
    const dataBase= req.app.locals.db;
    const userEmail= req.params.emailInput;
    const userPassword= req.params.passwordInput;
    const passwordSqlRequest="SELECT password FROM usersProfils WHERE email=?";
    const userProfilSqlRequest= "SELECT userId FROM usersProfils WHERE email=?";
    const emailSqlRequest="SELECT email FROM usersProfils";

    dataBase.query(emailSqlRequest , function(err, emails){
        if(emails.find(email=>email.email===userEmail)){
            dataBase.query( passwordSqlRequest,userEmail, function(err, password){
                if (password[0].password===hidePassword(userPassword)){
                    dataBase.query(userProfilSqlRequest,userEmail, function(err, userProfil){
                        const userKey= generateAuthToken();
                        usersKeys[userKey]=userProfil[0].userId
                        res.cookie("userKey", userKey, {
                            httpOnly: false,
                            sameSite: "strict",
                            signed: true
                        })
                        res.json(req.signedCookies.userKey)
                    })
                } else {
                    res.json("mdp");
                }
            });
        } else {
            res.json("mail");
        }
    });

})
module.exports = router;

router.get("/userProfil", function(req, res, next){
    const dataBase= req.app.locals.db;
    const userProfilSqlRequest=`SELECT  * FROM usersProfils
                                INNER JOIN towns
                                ON usersProfils.townId = towns.townId
                                WHERE usersProfils.userId=?`;
    if(usersKeys[req.signedCookies.userKey]){
        dataBase.query(userProfilSqlRequest,usersKeys[req.signedCookies.userKey], function(err, userDetails){
            delete userDetails[0].password;
            res.json(userDetails);
        })
    }else {
        res.json("Probleme de chargement");
    }
})
module.exports = router;

router.get("/userProfilHistory", function(req, res, next){
    const dataBase= req.app.locals.db;
    const sqlHistoryRequest=`SELECT * FROM forumPosts
                                INNER JOIN forumTopics
                                ON forumPosts.topicId = forumTopics.topicId
                                WHERE forumPosts.userId=?`
    if(usersKeys[req.signedCookies.userKey]){
        dataBase.query(sqlHistoryRequest,usersKeys[req.signedCookies.userKey], function(err, topic){
            console.log(topic);
            res.json(topic)
        })
    }
})
module.exports = router;
