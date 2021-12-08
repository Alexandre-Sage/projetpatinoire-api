var express = require('express');
var router = express.Router();

router.get("/", function(req, res, next){
    const dataBase= req.app.locals.db;
    dataBase.query("SELECT * FROM forumCategories",[], function(err, forumCategories){
        if(err) throw err;
        res.json(forumCategories);
    })
})
module.exports = router;

router.get("/topics", function(req, res, next){
    const dataBase= req.app.locals.db;
    dataBase.query("SELECT * FROM forumTopics",[], function(err, forumTopics){
        if(err) throw err;
        res.json(forumTopics);
    })
})
module.exports = router;

router.get("/posts", function(req, res, next){
    const dataBase= req.app.locals.db;
    dataBase.query("SELECT * FROM forumPosts",[], function(err, forumPosts){
        if(err) throw err;
        res.json(forumPosts);
    })
})
module.exports = router;
