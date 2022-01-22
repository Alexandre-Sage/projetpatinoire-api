var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var multer = require('multer');
var app = express();
var usersKeys= require("./modules/session/usersKeys");
var userSession= require("./modules/session/userSession");
var sqlRequests= require("./sqlRequests/usersImagesSqlRequests");
const upload= multer({dest: "./public/images/usersImages"});

//Route pour récuppérer toutes les images d'un utilisateur fetcher par userImageJsx
router.get("/", function(req,res,next){
    const dataBase= req.app.locals.db;
    dataBase.query(sqlRequests.sqlRequestAllImagesRoute,[usersKeys[req.signedCookies.userKey]], (err, downloadImages)=>{
        res.json(downloadImages)
    })
})
module.exports = router;

//Route historique des photos fetcher par PictureHistoryJsx
router.get("/history",function(req,res,next){
    const dataBase= req.app.locals.db;
    if(userSession.authentification(usersKeys, req.signedCookies.userKey)){
        dataBase.query(sqlRequests.sqlRequestImageHistoryRoute,[usersKeys[req.signedCookies.userKey]], (err, images)=>{
            console.log(images);
            res.json(images)
        })
    }
})
module.exports = router;

//Route téléchargement des images de l'utilisateur fetcher par UserImages.jsx
router.post("/upload",upload.single("image"), async function(req,res,next){
    const dataBase= req.app.locals.db;
    let sucess=false
    if(userSession.authentification(usersKeys, req.signedCookies.userKey)){
        do{
            try{
                await  dataBase.promise().query(sqlRequests.sqlRequestUploadRoute,[usersKeys[req.signedCookies.userKey],req.file.path, req.body.title, req.body.description]);
                console.log("ok");
                sucess=true
            } catch(err){
                console.log(err);
            }
        } while(!sucess){
            res.json("image envoyer avec succès")
        }
    }
})
module.exports = router;

//Route pour changers l'image du profils
router.post("/profilPictureChange/:urlRequest",async function(req,res,next){
    const dataBase= req.app.locals.db;
    let sucess=false;
    do{
        try{
            if(userSession.authentification(usersKeys, req.signedCookies.userKey)){
                await dataBase.promise().query(sqlRequests.sqlRequestChangeProfilPictureRoute, [req.params.urlRequest,usersKeys[req.signedCookies.userKey]]);
                sucess=true;
            }else {
                res.json("Veuillez vous connectez")
            }
        } catch(err){
            console.log(err);
            res.json("Une erreur est survenue veuillez éssayer a nouveaux")
        }
    } while(!sucess){
        res.json("Votre photo profil à bien été modifier")
    }
})
module.exports = router;
