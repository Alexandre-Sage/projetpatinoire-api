var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var multer = require('multer');
var app = express();
var usersKeys= require("./modules/usersKeys")

const upload= multer({dest: "./public/images/usersImages"})
router.post("/",upload.single("image"), async function(req,res,next){
    const dataBase= req.app.locals.db;
    let sucess=false
    if(usersKeys[req.signedCookies.userKey]){
        do{
            try{
                await dataBase.promise().query(`INSERT INTO userImages(userId, imagePath,imageUploadDate) VALUES(?,?, NOW())`,[usersKeys[req.signedCookies.userKey],req.file.path]);
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

    //console.log(req.file.path);
    //console.log(req.headers);
    //console.log(req.body);




router.get("/image", function(req,res,next){
    const dataBase= req.app.locals.db;
    //const sqlRequest="SELECT profilPicture FROM usersProfils WHERE id=1";
    dataBase.query("SELECT * FROM userImages WHERE imageId=1", (err, downloadImages)=>{
        console.log(downloadImages);
        res.json({ downloadImages})

    })
})
module.exports = router;
