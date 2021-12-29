var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var multer = require('multer');
var app = express()

const upload= multer({dest: "./public/images/"})


router.post("/",upload.single("image"),  function(req,res,next){
    const dataBase= req.app.locals.db;
    console.log(req.signedCookies);
    //console.log(req.file.path);
    //console.log(req.headers);
    //console.log(req.body);
    dataBase.query("UPDATE usersProfils SET profilPicture=? WHERE userId=1",
    [req.file.path])

})
module.exports = router;



router.get("/image", function(req,res,next){
    const dataBase= req.app.locals.db;
    //const sqlRequest="SELECT profilPicture FROM usersProfils WHERE id=1";
    dataBase.query("SELECT profilPicture FROM usersProfils WHERE userId=1", (err, downloadImages)=>{
        res.json({
            image: downloadImages[0].profilPicture
        })

    })
})
module.exports = router;
