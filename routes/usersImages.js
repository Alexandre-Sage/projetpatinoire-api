var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var multer = require('multer');
var app = express();
var usersKeys= require("./modules/usersKeys")

const upload= multer({dest: "./public/images/usersImages"})

router.get("/", function(req,res,next){
    const dataBase= req.app.locals.db;
    const sqlRequest= "SELECT * FROM userImages WHERE userId=?";
    dataBase.query(sqlRequest,[usersKeys[req.signedCookies.userKey]], (err, downloadImages)=>{
        console.log(downloadImages);
        res.json({ downloadImages})

    })
})
module.exports = router;


router.post("/upload",upload.single("image"), async function(req,res,next){
    const dataBase= req.app.locals.db;
    let sucess=false
    sqlRequest=`INSERT INTO userImages(userId, imagePath,imageUploadDate) VALUES(?,?, NOW())`;
    if(usersKeys[req.signedCookies.userKey]){
        do{
            try{
                await dataBase.promise().query(sqlRequest,[usersKeys[req.signedCookies.userKey],req.file.path]);
                console.log("ok");
                sucess=true
            } catch(err){
                console.log(err);
            }
        } while(!sucess){
            res.json("image envoyer")
        }
    }
})
module.exports = router;

router.post("/profilPicture",async function(res,req,next){
    const dataBase= req.app.locals.db;
    let sucess=false;
    sqlRequestFirstProfilPicture='INSERT INTO profilPicture(userId, imageId) VALUES(?,?)'
    sqlRequestAfter='UPDATE profilPicture SET imageId=? WHERE userId=?';
    if(usersKeys[req.signedCookies.userKey]){

    }
})

    //console.log(req.file.path);
    //console.log(req.headers);
    //console.log(req.body);
