var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var multer = require('multer');
var app = express();
var usersKeys= require("./modules/usersKeys")

const upload= multer({dest: "./public/images/usersImages"})

//Route pour récuppérer toutes les images d'un utilisateur fetcher par userImageJsx
router.get("/", function(req,res,next){
    const dataBase= req.app.locals.db;
    const sqlRequest= "SELECT * FROM userImages WHERE userId=?";
    dataBase.query(sqlRequest,[usersKeys[req.signedCookies.userKey]], (err, downloadImages)=>{
        //console.log(downloadImages);
        res.json(downloadImages)
    })
})
module.exports = router;

//Route historique des photos fetcher par PictureHistoryJsx
router.get("/history",function(req,res,next){
    const dataBase= req.app.locals.db;
    const sqlRequest=`SELECT * FROM userImages
                        WHERE userId=1
                        ORDER BY imageUploadDate DESC
                        LIMIT 3`
    if(usersKeys[req.signedCookies.userKey]){
        dataBase.query(sqlRequest,[usersKeys[req.signedCookies.userKey]], (err, images)=>{
            res.json(images)
        })
    }
})
module.exports = router;

//Route téléchargement des images de l'utilisateur fetcher par UserImages.jsx
router.post("/upload",upload.single("image"), async function(req,res,next){
    const dataBase= req.app.locals.db;
    //console.log(req.file);
    //console.log(req.body.title);
    let sucess=false
    sqlRequest=`INSERT INTO userImages(userId, imagePath, imageTitle, imageDescription,imageUploadDate) VALUES(?,?,?,?, NOW())`;
    if(usersKeys[req.signedCookies.userKey]){
        do{
            try{
                await dataBase.promise().query(sqlRequest,[usersKeys[req.signedCookies.userKey],req.file.path, req.body.title, req.body.description]);
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

//Route pour changer l'image du profils
router.post("/profilPicture/:urlRequest",async function(res,req,next){
    const dataBase= req.app.locals.db;
    let sucess=false;
    let firstPicture=true;
    const sqlRequestProfilsPictures= `SELECT userId FROM profilPicture`
    const sqlRequestFirstProfilPicture='INSERT INTO profilPicture(userId, imageId) VALUES(?,?)'
    const sqlRequestAfter='UPDATE profilPicture SET imageId=? WHERE userId=?';
    if(usersKeys[req.signedCookies.userKey]){
        do{
            try{
                await dataBase.promise().query(sqlRequestProfilsPictures, function(err, usersId){
                    if(usersId.find(userId=>userId.userId===usersKeys[req.signedCookies.userKey])){
                        console.log("yes");
                        dataBase.query(sqlRequestAfter,[req.params.urlRequest,usersKeys[req.signedCookies.userKey]]);
                        sucess=true;
                    } else{
                        dataBase.query(sqlRequestFirstProfilPicture,[usersKeys[req.signedCookies.userKey],req.params.urlRequest]);
                        sucess=true;
                    }
                })
            } catch(err){
                console.log(err);
            }
        } while(!sucess){
            res.json("Photo Profil définis")
        }
    } else{
        res.json("Utilisateur Inconnue")
    }
})
module.exports = router;
    //console.log(req.file.path);
    //console.log(req.headers);
    //console.log(req.body);
