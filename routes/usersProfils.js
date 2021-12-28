var express = require('express');
var router = express.Router();
var slugify = require("slugify");
var crypto = require("crypto");
var cookieParser = require('cookie-parser');
var app = express();



const usersKeys={};

function hidePassword(password){
    const sha256= crypto.createHash("sha256");
    const hide= sha256.update(password).digest('base64');
    return hide;
};

function generateAuthToken(){
    return crypto.randomBytes(30).toString('hex');
};

app.use((req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies['userKey'];

    // Inject the user to the request
    req.user = usersKeys[userKey];

    next();
});
/*https://expressjs.com/en/resources/middleware/cookie-session.html*/

router.post("/:emailInput/:passwordInput", function(req, res, next){
    const dataBase= req.app.locals.db;
    const userEmail= req.params.emailInput;
    const userPassword= req.params.passwordInput;
    const passwordSqlRequest="SELECT password FROM usersProfils WHERE email=?";
    const userProfilSqlRequest= "SELECT * FROM usersProfils WHERE email=?";
    const emailSqlRequest="SELECT email FROM usersProfils";

    dataBase.query(emailSqlRequest , function(err, emails){
        if(emails.find(email=>email.email===userEmail)){
            dataBase.query( passwordSqlRequest,userEmail, function(err, password){
                if (password[0].password===hidePassword(userPassword)){
                    dataBase.query(userProfilSqlRequest,userEmail, function(err, userProfil){
                        const userKey= generateAuthToken();
                        usersKeys[userKey]=userProfil[0].userId
                        console.log(usersKeys);
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
    res.json("ok")
    const token= req.signedCookies;
    console.log(token[userKey]);
    console.log(usersKeys);
})
