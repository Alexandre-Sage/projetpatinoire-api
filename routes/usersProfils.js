var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var slugify = require("slugify");
var app = express();
var sqlRequests= require("./sqlRequests/userProfilSqlRequests");
var usersKeys= require("./modules/session/usersKeys");
var userSession= require("./modules/session/userSession");

//Route de connexions créer les cookies d'authentifications transmis ensuite dans la liste des userskeys et envoyer au frontEnd
router.post("/", function(req, res, next){
    const dataBase= req.app.locals.db;
    const userEmail= req.body.emailInput;
    const userPassword= req.body.passwordInput;
    dataBase.query(sqlRequests.emailCheckSqlRequestConnexionRoute , function(err, emails){
        if(emails.find(email=>email.email===userEmail)){
            dataBase.query(sqlRequests.passwordSqlRequestConnexionRoute,userEmail, function(err, password){
                if (password[0].password===userSession.hidePassword(userPassword)){
                    dataBase.query(sqlRequests.userProfilSqlRequestConnexionRoute,userEmail, function(err, userProfil){
                        console.log(userProfil)
                        const userKey= userSession.generateAuthToken();
                        usersKeys[userKey]=userProfil[0].userId
                        res.cookie("userKey", userKey, {
                            httpOnly: false,
                            sameSite: "strict",
                            signed: true
                        })
                        res.json({
                            "userParams":{
                                "userName": userProfil[0].userName,
                                "userId":userProfil[0].userId
                            },
                            "message": "Connexion réussi",
                            "validator": true
                        })
                    })
                } else {
                    res.json({
                        "userName": null,
                        "message": "Mot de passe incorrecte veuillez ré éssayer",
                        "validator": false
                    });
                }
            });
        } else {
            res.json({
                "userName": null,
                "message":"Email inconnue veuillez ré éssayer",
                "validator": false
            });
        }
    });
})
module.exports = router;

router.get("/userProfil/:userId", function(req, res, next){
    const dataBase= req.app.locals.db;
    let userId;
    let profilOwner;
    if(parseInt(req.params.userId)===usersKeys[req.signedCookies.userKey]){
        console.log("userProfils");
        userId=usersKeys[req.signedCookies.userKey]
        profilOwner=true;
    } else{
        console.log("otherProfils");
        userId=req.params.userId
        profilOwner=false;
    }
    if(userSession.authentification(usersKeys, req.signedCookies.userKey)){
        dataBase.query(sqlRequests.userProfilSqlRequestUserProfilRoute,[userId], function(err, userDetails){
            console.log(err);
            console.log(userDetails);
            delete userDetails[0].password;
            /*const newConnDate= "UPDATE usersProfils SET lastConnexion= NOW() WHERE userId=?"
            dataBase.query(newConnDate,[userId],(err, info)=>{
                if(err){
                    console.log(err);
                } else if (info) {
                    console.log(info);
                }
            })*/
            res.json({
                "userDetails":userDetails,
                "profilOwner":profilOwner,
                "firstConnexion": userDetails[0].lastConnexion===null?true:false
            });
        })
    }else {
        res.json("Probleme de chargement");
    }
})
module.exports = router;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/userProfilForumHistory/:userId", function(req, res, next){
    const dataBase= req.app.locals.db;
    let userId;
    if(parseInt(req.params.userId)===usersKeys[req.signedCookies.userKey]){
        console.log("userProfils");
        userId=usersKeys[req.signedCookies.userKey]
    } else{
        console.log("otherProfils");
        userId=req.params.userId
    }
    if(userSession.authentification(usersKeys, req.signedCookies.userKey)){
        dataBase.query(sqlRequests.sqlHistoryRequestRoute, [userId], function(err, post){
            res.json(post)
        })
    }
})
module.exports = router;

router.post("/updateProfil", async function(req, res, next){
    const dataBase= req.app.locals.db;
    const postedData= req.body;
    console.log(postedData);
    let sucess= false;

    if(userSession.authentification(usersKeys, req.signedCookies.userKey)){
        do{
            try{
                await dataBase.promise().query(sqlRequests.sqlRequestUpdateProfilRoute,[postedData.userName,postedData.email,postedData.firstName, postedData.LastName, postedData.homeSpot, postedData.birthday, postedData.countryId, postedData.townId, usersKeys[req.signedCookies.userKey]])
                sucess=true;
            }catch(err){
                switch(err.sqlMessage){
                    case `Duplicate entry '${postedData.userName}' for key 'userName'`:
                        res.json({
                            "message":`Le pseudo ${postedData.userName} est déja utiliser veuillez en choisir un autres`
                        })
                    break;
                    case `Duplicate entry '${postedData.email}' for key 'email'`:
                        res.json({
                            "message":`L'adresse email ${postedData.email} est déja utiliser veuillez en choisir un autres`
                        })
                    break;
                    default:
                        res.json({
                            "message":"Une érreur est survenue veuillez réssayer."
                        })
                    break;
                }
            }
        } while(!sucess){
            res.json({
                "message":"Votre Profil à été modifier avec succès"
            })
        }
    } else {
        res.json({
            "message":"Veuillez vous connectez pour éffectuer cette opération"
        })
    }
})
module.exports = router;

router.post("/updatePassword", async function(req, res, next){
    const dataBase= req.app.locals.db;
    const postedData= req.body;
    console.log(postedData);
    let sucess= false;
    let passwordAuthentification=false;

    if(userSession.authentification(usersKeys, req.signedCookies.userKey)){
        dataBase.query(sqlRequests.sqlRequestPasswordConfirmationUpdatePasswordRoute,[usersKeys[req.signedCookies.userKey]] ,function(err, password){
            console.log(password);
            console.log(err);
            if(password[0].password===userSession.hidePassword(postedData.actualPassword)){
                passwordAuthentification=true;
                console.log(passwordAuthentification);
                console.log(password[0].password);
            } else{
                res.json({
                    "message":"Authentification échouer veuillez ré éssayer"
                })
            }
        })
        if(!passwordAuthentification){
            do{
                try{
                    await dataBase.promise().query(sqlRequests.sqlRequestUpdatePasswordRoute,[userSession.hidePassword(postedData.newPassword), usersKeys[req.signedCookies.userKey]])
                    sucess=true;
                } catch(err){
                    res.json(err)
                }
            } while(!sucess){
                res.json({
                    "message":"Mot de passe changer avec succès"
                })
            }
        }
    } else{
        res.json({
            "message":"Une érreur est survenue veuillez ré éssayer"
        })
    }
})
module.exports = router;
