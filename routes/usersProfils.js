var express = require('express');
var router = express.Router();

router.get("/", function(req, res, next){
    const dataBase= req.app.locals.db;
    dataBase.query("SELECT * FROM usersProfils",[], function(err, userProfil){
        if(err) throw err;
        res.json(userProfil);
    })
})
module.exports = router;
