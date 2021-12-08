var express = require('express');
var router = express.Router();
var cors = require('cors');
var app = express();

app.use(cors());

router.get("/", function(req, res, next){
console.log("something");
    const dataBase= req.app.locals.db;
    dataBase.query("SELECT * FROM usersProfils",[], function(err, userProfil){
        if(err) throw err;
        res.json(userProfil);

    })
})
module.exports = router;

/*router.post("/inscription", function(req, res, next){
    const dataBase= req.app.locals.db;
});
module.exports = router;*/
