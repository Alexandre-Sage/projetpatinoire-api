var express = require('express');
var router = express.Router();


router.get("/", function(req, res, next){
    const dataBase= req.app.locals.db;
    dataBase.query("SELECT * FROM chatFlows",[], function(err, chatFlows){
        if(err) throw err;
        res.json(chatFlows);
    })
});
module.exports = router;

router.get("/messages", function(req, res, next){
    const dataBase= req.app.locals.db;
    dataBase.query("SELECT * FROM chatMessages",[], function(err, chatMessages){
        if(err) throw err;
        res.json(chatMessages);
    })
});
module.exports = router;
