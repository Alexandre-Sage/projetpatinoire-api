var express = require('express');
var router = express.Router();
var slugify = require("slugify");
var crypto = require("crypto");
var cookieParser = require('cookie-parser');
var app = express();

app.use(cookieParser("secret"));

const usersKeys={};

function hidePassword(password){
    const sha256= crypto.createHash("sha256");
    const hide= sha256.update(password).digest('base64');
    return hide;
};

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
};
/*https://expressjs.com/en/resources/middleware/cookie-session.html*/

router.post("/:emailInput/:passwordInput", async function(req, res, next){

    console.log(req.params);
    const dataBase= req.app.locals.db;
    const userEmail= req.params.emailInput;
    const userPassword= req.params.passwordInput;
    let passwordConfirmation= false;
    const passwordSqlRequest="SELECT password FROM usersProfils WHERE email=?";
    const userProfilSqlRequest= "SELECT * FROM usersProfils WHERE email=?";
    const emailSqlRequest="SELECT email FROM usersProfils";


    dataBase.query(emailSqlRequest , function(err, emails){
        const emailConfirmation=emails.find(email=>email.email===userEmail);
        if(emailConfirmation){
            dataBase.query( passwordSqlRequest,userEmail, function(err, password){
                {password[0].password===hidePassword(userPassword)? passwordConfirmation=true:passwordConfirmation=false};
                if (passwordConfirmation){
                    dataBase.query(userProfilSqlRequest,userEmail, function(err, userProfil){
                        const userKey= generateAuthToken();
                        usersKeys[userKey]=userProfil[0].userId
                        console.log(usersKeys);
                        res.cookie("userKey", userKey, { httpOnly: false, // try this
                                                            sameSite: "strict",
                                                            signed: true})
                        res.send(req.signedCookies.userKey)
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
